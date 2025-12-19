import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  FileText,
  Database,
  AlertTriangle,
  CheckCircle,
  Send,
  Plus,
  Search,
  Play,
  RefreshCw,
  Share2,
  FileQuestion,
  FileBarChart,
  StickyNote,
  GraduationCap,
  Sparkles,
  Clock,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelRightClose,
  Bell,
  Zap,
  User,
  CheckSquare,
  Square,
  History,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
  X,
  Trash2,
  Power,
  ExternalLink,
  Mic,
  FileCheck,
  GitBranch,
  ClipboardList,
  HelpCircle,
  BarChart2,
  Monitor,
  Edit2,
  ShieldAlert,
  Upload,
  FileUp,
  ChevronDown,
  Layers,
  Volume2,
  Pause,
  SkipForward,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// --- Mock Data ---
const INITIAL_POLICIES = [
  {
    id: 3,
    name: '정보보안 정책서',
    version: 'v5.1',
    type: 'pdf',
    status: 'active',
    pages: 203,
    category: '보안',
    lastUpdated: '2024-10-15',
    versions: [
      { version: 'v5.1', date: '2024-10-15', changes: '비밀번호 복잡도 강화' },
      { version: 'v5.0', date: '2024-07-01', changes: '제로 트러스트 도입' },
    ]
  },
  {
    id: 6,
    name: '내부회계관리제도 RCM',
    version: 'v2.1',
    type: 'pdf',
    status: 'active',
    pages: 142,
    category: '내부회계',
    lastUpdated: '2024-11-15',
    versions: [
      { version: 'v2.1', date: '2024-11-15', changes: '리스크 평가 기준 업데이트' },
      { version: 'v2.0', date: '2024-06-01', changes: '통제활동 강화' },
    ]
  },
  {
    id: 1,
    name: '내부회계관리제도 운영규정',
    version: 'v3.2',
    type: 'pdf',
    status: 'active',
    pages: 87,
    category: '내부회계',
    lastUpdated: '2024-11-01',
    versions: [
      { version: 'v3.2', date: '2024-11-01', changes: '승인 절차 강화, 금액 기준 상향' },
      { version: 'v3.1', date: '2024-06-15', changes: '보고 주기 변경' },
      { version: 'v3.0', date: '2024-01-01', changes: '전면 개정' },
    ]
  },
  { id: 4, name: '인사관리 사규', version: 'v2.0', type: 'doc', status: 'active', pages: 156, category: '사규', lastUpdated: '2024-03-01', versions: [] },
  { id: 5, name: 'IT 시스템 운영 정책', version: 'v1.3', type: 'pdf', status: 'active', pages: 98, category: 'IT', lastUpdated: '2024-08-20', versions: [] },
  {
    id: 2,
    name: 'ESG 경영 가이드라인',
    version: '2024',
    type: 'pdf',
    status: 'active',
    pages: 124,
    category: 'ESG',
    lastUpdated: '2024-01-15',
    versions: [
      { version: '2024', date: '2024-01-15', changes: '환경 목표 강화' },
      { version: '2023', date: '2023-01-10', changes: '사회적 책임 강화' },
    ]
  },
];

const INITIAL_DBS = [
  { id: 1, name: 'HR_Master_DB', type: 'Oracle', status: 'connected', records: '15.2K' },
  { id: 2, name: 'Financial_System', type: 'SAP HANA', status: 'connected', records: '2.3M' },
  { id: 3, name: 'Access_Logs_2024', type: 'Elasticsearch', status: 'connected', records: '48.7M' },
];

const INITIAL_EXTERNAL_REGULATIONS = [
  {
    id: 1,
    title: '전자금융거래법 시행령 개정',
    source: '금융위원회',
    date: '2024-12-15',
    url: 'https://www.fsc.go.kr/notice/123',
    isNew: true,
    summary: '법인카드 사용 한도 변경 (500만원 → 300만원), 심야시간 거래 제한 신설',
    suggestedRules: [
      {
        name: '법인카드 300만원 초과 거래 감지',
        severity: 'high',
        description: '법인카드 일일 사용액이 300만원을 초과하는 거래 모니터링',
        query: 'SELECT * FROM card_transactions WHERE card_type="법인" AND amount > 3000000'
      },
      {
        name: '심야시간 거래 모니터링',
        severity: 'medium',
        description: '22시~06시 사이 거래 내역 확인',
        query: 'SELECT * FROM transactions WHERE HOUR(transaction_time) >= 22 OR HOUR(transaction_time) < 6'
      }
    ]
  },
  {
    id: 2,
    title: '내부회계관리제도 운영 가이드 개정',
    source: '금융감독원',
    date: '2024-12-10',
    url: 'https://www.fss.or.kr/notice/456',
    isNew: true,
    summary: '통제활동 증거자료 보관 기간 연장 (3년 → 5년)',
    suggestedRules: [
      {
        name: '증거자료 보관기간 점검',
        severity: 'medium',
        description: '통제활동 증거자료가 5년 이상 보관되었는지 확인',
        query: 'SELECT * FROM audit_documents WHERE DATEDIFF(NOW(), created_date) > 1825'
      }
    ]
  },
  {
    id: 3,
    title: '개인정보보호법 시행규칙 개정',
    source: '개인정보보호위원회',
    date: '2024-12-08',
    url: 'https://www.pipc.go.kr/notice/789',
    isNew: true,
    summary: '개인정보 파기 시 암호화 의무화, 파기 기록 보관 3년',
    suggestedRules: [
      {
        name: '개인정보 파기 기록 확인',
        severity: 'high',
        description: '개인정보 파기 시 암호화 및 기록 보관 여부 확인',
        query: 'SELECT * FROM data_deletion_logs WHERE encrypted = false OR retention_date IS NULL'
      }
    ]
  }
];

const INITIAL_RULES = [
  {
    id: 1,
    name: '비밀번호 90일 미변경 감지',
    policy: '정보보안 정책서 v5.1',
    policyId: 3,
    dataSource: 'HR_Master_DB',
    status: 'active',
    schedule: '매일 09:00',
    violations: 23,
    severity: 'high',
    notification: true,
    query: 'SELECT user_id, name, last_password_change FROM users WHERE DATEDIFF(NOW(), last_password_change) > 90',
    lastRun: '2024-12-01 09:00',
    description: '직원들의 비밀번호 변경 주기가 90일을 초과하는지 감지'
  },
  {
    id: 2,
    name: '관리자 권한 무단 접근 감지',
    policy: '접근권한 관리 규정 v1.2',
    policyId: null,
    dataSource: 'Access_Logs_2024',
    status: 'active',
    schedule: '실시간',
    violations: 3,
    severity: 'critical',
    notification: true,
    query: 'SELECT user_id, ip_address, access_time FROM access_logs WHERE role="admin" AND ip_address NOT IN (SELECT approved_ip FROM approved_ips)',
    lastRun: '2024-12-01 14:23',
    description: '승인되지 않은 IP에서 관리자 권한 접근 시도 감지'
  },
  {
    id: 3,
    name: 'ESG 교육 미이수 점검',
    policy: 'ESG 경영 가이드라인 2024',
    policyId: 2,
    dataSource: 'HR_Master_DB',
    status: 'paused',
    schedule: '매주 월요일',
    violations: 0,
    severity: 'medium',
    notification: false,
    query: 'SELECT employee_id, name FROM employees WHERE esg_training_completed = false',
    lastRun: '2024-11-25 09:00',
    description: 'ESG 필수 교육을 이수하지 않은 직원 확인'
  },
  {
    id: 4,
    name: '내부회계 승인 절차 검증',
    policy: '내부회계관리제도 운영규정 v3.2',
    policyId: 1,
    dataSource: 'Financial_System',
    status: 'active',
    schedule: '매일 18:00',
    violations: 2,
    severity: 'critical',
    notification: true,
    query: 'SELECT transaction_id, amount, approver FROM transactions WHERE amount > 10000000 AND approval_status = "pending"',
    lastRun: '2024-11-30 18:00',
    description: '1천만원 이상 거래의 승인 절차 준수 여부 확인'
  },
];

// Typing animation component
const TypingText = ({ text, isTyping }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20); // 20ms per character for smooth typing

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, isTyping]);

  useEffect(() => {
    if (isTyping) {
      setDisplayedText('');
      setCurrentIndex(0);
    } else {
      setDisplayedText(text);
    }
  }, [text, isTyping]);

  return <div className="whitespace-pre-wrap">{displayedText}</div>;
};

const MOCK_VIOLATIONS = [
  {
    id: 1,
    rule: '비밀번호 90일 미변경',
    severity: 'high',
    count: 23,
    description: '23명의 직원이 정보보안 정책서 4.2조에 따른 비밀번호 변경 주기(90일)를 위반했습니다.',
    policy: '정보보안 정책서 v5.1, 제4.2조',
  },
  {
    id: 2,
    rule: '관리자 권한 무단 접근',
    severity: 'critical',
    count: 3,
    description: '승인되지 않은 IP에서 관리자 권한으로 시스템 접근이 감지되었습니다.',
    policy: '접근권한 관리 규정, 제3.1조',
  }
];

const SUGGESTED_PROMPTS = [
  "이번 달 정보보안 정책 위반 현황은?",
  "ESG 관련 미이수 교육 대상자 조회해줘",
  "내부회계 승인 절차 위반 사례 분석",
  "개인정보보호 지침의 주요 내용 요약해줘"
];

const INITIAL_NOTES = [
  { id: 1, title: '새 메모', content: '3시간 전', type: 'new' },
  { id: 2, title: '인공지능 감사 및 통제 원칙', content: '소스 4개 · 6시간 전', type: 'saved' },
  { id: 3, title: '신뢰 가능한 AI 거버넌스 및 위험', content: '2일 전', type: 'saved' }
];

// --- Components ---

const ResizablePanel = ({ children, side, width, onResize, isCollapsed, onToggleCollapse }) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e) => {
    if (isCollapsed) return;
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || isCollapsed) return;
      if (side === 'left') {
        onResize(Math.max(60, Math.min(800, e.clientX)));
      } else if (side === 'right') {
        onResize(Math.max(60, Math.min(1200, window.innerWidth - e.clientX)));
      }
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, side, onResize, isCollapsed]);

  if (isCollapsed) {
    return (
      <motion.div
        className="relative flex flex-shrink-0 bg-[#1a1a1a] border-r border-gray-800"
        initial={false} 
        animate={{ width: 60 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="w-full h-screen flex items-center justify-center py-4">
          <button onClick={onToggleCollapse} className="p-3 hover:bg-gray-800 rounded-lg text-blue-400">
            {side === 'left' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative flex flex-shrink-0"
      initial={false} 
      animate={{ width }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
      <div
        className={clsx(
          "absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-50",
          side === 'left' ? 'right-0' : 'left-0',
          isResizing && 'bg-blue-500'
        )}
        onMouseDown={handleMouseDown}
      />
    </motion.div>
  );
};

const PolicyHistoryModal = ({ policy, onClose }) => {
  if (!policy) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">{policy.name}</h3>
            <p className="text-sm text-gray-400">버전 이력 관리</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          {policy.versions && policy.versions.length > 0 ? (
            policy.versions.map((v, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-gray-700 pb-4 last:pb-0">
                <div className={clsx(
                  "absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2",
                  i === 0 ? "bg-blue-500 border-blue-500" : "bg-[#1a1a1a] border-gray-600"
                )} />
                <div className="flex justify-between items-start mb-1">
                  <span className={clsx("font-bold", i === 0 ? "text-blue-400" : "text-gray-300")}>
                    {v.version}
                  </span>
                  <span className="text-xs text-gray-500">{v.date}</span>
                </div>
                <p className="text-sm text-gray-400">{v.changes}</p>
                {i === 0 && <span className="inline-block mt-2 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">현재 버전</span>}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">이력이 없습니다.</p>
          )}
        </div>
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-2">
          <button className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg">닫기</button>
          <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2">
            <Plus size={14} /> 새 버전 업로드
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Demo Queue Panel Component
const DemoQueuePanel = ({ onClose, onStartAutoDemo, isDemoRunning, currentStep }) => {
  const [currentStepLocal, setCurrentStepLocal] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const demoSteps = [
    { 
      time: '0:00-0:20', 
      title: '정책서 업로드 & AI 규칙 제안',
      narration: '안녕하세요. RuleX AI 기반 자동화 감사 솔루션을 소개합니다. 먼저, 내부회계관리제도 RCM 정책서를 업로드하겠습니다.',
      actions: ['좌측 패널 "정책서 추가" 클릭', '파일 업로드', 'AI가 3개 규칙 자동 제안 확인']
    },
    { 
      time: '0:20-0:40', 
      title: 'AI 규칙 일괄 승인',
      narration: 'AI가 정책서를 분석하여 고액거래 모니터링, 직무분리 위반 감지, 재고실사 미실시 탐지 규칙을 제안했습니다. 체크박스로 선택하고 일괄 승인하겠습니다.',
      actions: ['규칙 3개 선택', '일괄 승인 버튼 클릭', '우측 규칙 관리 탭 확인']
    },
    { 
      time: '0:40-1:00', 
      title: '실시간 위반 탐지',
      narration: '규칙이 활성화되면 3초 이내에 실시간으로 위반 사항을 자동 탐지합니다. 실제로 위반이 감지되었습니다.',
      actions: ['자동 위반 알림 대기', '모니터링 탭 확인', '위반 건수 확인']
    },
    { 
      time: '1:00-1:20', 
      title: 'DB 연결',
      narration: '이제 채팅으로 데이터베이스를 연결해보겠습니다. Inventory System DB 연결해 줘 라고 입력합니다.',
      actions: ['채팅 입력창 클릭', '"Inventory_System DB 연결해줘" 입력', '연결 성공 확인']
    },
    { 
      time: '1:20-2:00', 
      title: '위반 조치 & 보고서 생성',
      narration: '마지막으로 위반 사항에 대한 조치를 접수하고, 원클릭으로 감사 보고서를 생성할 수 있습니다. 이렇게 RuleX는 97%의 시간을 절감하고 실시간으로 위반을 탐지합니다.',
      actions: ['위반 상세 확인', '조치 접수', '보고서 다운로드']
    }
  ];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handlePlayStep = (index) => {
    setCurrentStepLocal(index);
    setIsPlaying(true);
    speak(demoSteps[index].narration);
  };

  const handleNext = () => {
    stopSpeaking();
    if (currentStepLocal < demoSteps.length - 1) {
      handlePlayStep(currentStepLocal + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    stopSpeaking();
  };

  React.useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  React.useEffect(() => {
    if (isDemoRunning) {
      setCurrentStepLocal(currentStep);
      speak(demoSteps[currentStep]?.narration || '');
    }
  }, [currentStep, isDemoRunning]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-3xl border border-[#404040]"
      >
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="text-blue-400" size={20} />
              데모 시연 큐
            </h3>
            <p className="text-sm text-gray-400">2분 시연 가이드 - 자동 음성 나레이션 & 자동 실행</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            {demoSteps.map((step, index) => (
              <div
                key={index}
                className={clsx(
                  "p-4 rounded-xl border-2 transition-all cursor-pointer",
                  (currentStepLocal === index && isPlaying) || (isDemoRunning && currentStep === index)
                    ? "bg-blue-900/20 border-blue-500"
                    : "bg-[#2a2a2a] border-[#404040] hover:border-blue-500/50"
                )}
                onClick={() => handlePlayStep(index)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{step.time}</span>
                      <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                      {isDemoRunning && currentStep === index && (
                        <span className="text-xs bg-green-500/20 px-2 py-0.5 rounded text-green-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                          자동 실행 중
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-2">{step.narration}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {step.actions.map((action, i) => (
                        <span key={i} className="text-[10px] bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {((currentStepLocal === index && isSpeaking) || (isDemoRunning && currentStep === index)) && (
                      <Volume2 size={16} className="text-blue-400 animate-pulse" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayStep(index);
                      }}
                      className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
                      disabled={isDemoRunning}
                    >
                      <Play size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isPlaying && !isDemoRunning && (
              <span className="text-xs text-blue-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                진행 중: {demoSteps[currentStepLocal].title}
              </span>
            )}
            {isDemoRunning && (
              <span className="text-xs text-green-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                자동 데모 실행 중: {demoSteps[currentStep]?.title}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {!isDemoRunning && (
              <button
                onClick={onStartAutoDemo}
                className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg flex items-center gap-2 font-semibold"
              >
                <Play size={14} />
                자동 재생 시작
              </button>
            )}
            {isPlaying && !isDemoRunning && (
              <>
                <button
                  onClick={handlePause}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2"
                >
                  <Pause size={14} />
                  일시정지
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
                >
                  다음 단계
                  <SkipForward size={14} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg"
            >
              닫기
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


const ViolationDetailModal = ({ violation, onClose }) => {
  if (!violation) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">{violation.rule}</h3>
            <p className="text-sm text-gray-400">위반 상세 정보</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={clsx(
                "px-2 py-1 rounded text-xs font-semibold uppercase",
                violation.severity === 'critical' && "bg-red-500/20 text-red-400",
                violation.severity === 'high' && "bg-orange-500/20 text-orange-400",
                violation.severity === 'medium' && "bg-yellow-500/20 text-yellow-400"
              )}>
                {violation.severity}
              </span>
              <span className="text-sm text-gray-400">위반 건수: {violation.count}건</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{violation.description}</p>
          </div>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">관련 정책</p>
            <p className="text-sm text-white">{violation.policy}</p>
          </div>
        </div>
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-between gap-2">
          <button 
            onClick={() => {
              alert('감사 보고서가 다운로드됩니다.\n\n포함 내용:\n- 위반 사항 상세\n- SQL 쿼리 및 결과\n- 조치 이력\n- 담당자 정보');
            }}
            className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2"
          >
            <FileBarChart size={16} />
            보고서 다운로드
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg">닫기</button>
            <button 
              onClick={() => {
                alert('조치가 접수되었습니다.\n\n담당자에게 알림이 전송되었으며,\n조치 결과는 24시간 내에 업데이트됩니다.');
                onClose();
              }}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
            >
              <CheckCircle size={16} />
              조치 접수
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CreateRuleModal = ({ onClose, onCreate, policies, databases }) => {
  const [step, setStep] = useState(1);
  const [ruleName, setRuleName] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedDataSource, setSelectedDataSource] = useState(null);
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [schedule, setSchedule] = useState('매일 09:00');
  const [useNaturalLanguage, setUseNaturalLanguage] = useState(true);

  const handleGenerateQuery = () => {
    // AI simulation: Convert natural language to SQL
    const lowerDesc = description.toLowerCase();
    let generatedQuery = '';
    
    if (lowerDesc.includes('퇴사') || lowerDesc.includes('접근')) {
      generatedQuery = 'SELECT user_id, access_time FROM access_logs WHERE user_id IN (SELECT id FROM employees WHERE status="retired")';
    } else if (lowerDesc.includes('비밀번호')) {
      generatedQuery = 'SELECT user_id, name, last_password_change FROM users WHERE DATEDIFF(NOW(), last_password_change) > 90';
    } else if (lowerDesc.includes('교육') || lowerDesc.includes('미이수')) {
      generatedQuery = 'SELECT employee_id, name FROM employees WHERE training_completed = false';
    } else {
      generatedQuery = 'SELECT * FROM table_name WHERE condition = true';
    }
    
    setQuery(generatedQuery);
    setUseNaturalLanguage(false);
  };

  const handleCreate = () => {
    if (!ruleName || !selectedPolicy || !selectedDataSource || (!query && !description)) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    const newRule = {
      id: Date.now(),
      name: ruleName,
      policy: selectedPolicy.name,
      policyId: selectedPolicy.id,
      dataSource: selectedDataSource.name,
      status: 'active',
      schedule: schedule,
      violations: 0,
      severity: severity,
      notification: true,
      query: query || '자연어 설명으로 생성됨',
      lastRun: null,
      description: description
    };

    onCreate(newRule);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-5 border-b border-gray-800 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white">새 규칙 생성</h3>
            <p className="text-sm text-gray-400">정책 기반 모니터링 규칙을 생성합니다</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 규칙 이름 */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">규칙 이름 *</label>
            <input
              type="text"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="예: 퇴사자 시스템 접근 감지"
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#404040] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 기반 정책 선택 */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">기반 정책 *</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {policies.map(policy => (
                <button
                  key={policy.id}
                  onClick={() => setSelectedPolicy(policy)}
                  className={clsx(
                    "p-3 rounded-xl text-left transition-colors border-2",
                    selectedPolicy?.id === policy.id
                      ? "bg-blue-500/20 border-blue-500 text-white"
                      : "bg-[#2a2a2a] border-[#404040] text-gray-300 hover:border-[#606060]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span className="font-medium">{policy.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{policy.version}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 데이터 소스 선택 */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">데이터 소스 *</label>
            <div className="grid grid-cols-1 gap-2">
              {databases.map(db => (
                <button
                  key={db.id}
                  onClick={() => setSelectedDataSource(db)}
                  className={clsx(
                    "p-3 rounded-xl text-left transition-colors border-2",
                    selectedDataSource?.id === db.id
                      ? "bg-green-500/20 border-green-500 text-white"
                      : "bg-[#2a2a2a] border-[#404040] text-gray-300 hover:border-[#606060]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Database size={16} />
                    <span className="font-medium">{db.name}</span>
                    <span className="text-xs text-gray-500 ml-auto">{db.type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 규칙 설명 / 쿼리 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-300">규칙 정의 *</label>
              <button
                onClick={() => setUseNaturalLanguage(!useNaturalLanguage)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                {useNaturalLanguage ? 'SQL 직접 입력' : '자연어로 설명'}
              </button>
            </div>
            
            {useNaturalLanguage ? (
              <div className="space-y-2">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="예: 퇴사한 직원이 시스템에 접근하면 알림을 받고 싶어요"
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#404040] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-24 resize-none"
                />
                <button
                  onClick={handleGenerateQuery}
                  disabled={!description}
                  className={clsx(
                    "w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium",
                    description
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  )}
                >
                  <Sparkles size={16} />
                  AI로 SQL 쿼리 생성
                </button>
              </div>
            ) : (
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SELECT * FROM table_name WHERE condition = true"
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#404040] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 min-h-32 resize-none font-mono text-sm"
              />
            )}

            {query && (
              <div className="mt-2 p-3 bg-[#2a2a2a] border border-green-500/30 rounded-xl">
                <p className="text-xs text-green-400 mb-1 flex items-center gap-1">
                  <CheckCircle size={12} />
                  생성된 SQL 쿼리
                </p>
                <code className="text-xs text-gray-300 font-mono block">{query}</code>
              </div>
            )}
          </div>

          {/* 심각도 */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">심각도</label>
            <div className="grid grid-cols-4 gap-2">
              {['low', 'medium', 'high', 'critical'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverity(sev)}
                  className={clsx(
                    "py-2 rounded-lg text-sm font-medium capitalize transition-colors",
                    severity === sev
                      ? sev === 'critical' ? "bg-red-500/20 text-red-400 border-2 border-red-500"
                      : sev === 'high' ? "bg-orange-500/20 text-orange-400 border-2 border-orange-500"
                      : sev === 'medium' ? "bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500"
                      : "bg-blue-500/20 text-blue-400 border-2 border-blue-500"
                      : "bg-[#2a2a2a] text-gray-400 border-2 border-[#404040]"
                  )}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* 스케줄 */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">실행 스케줄</label>
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#404040] rounded-xl text-white focus:outline-none focus:border-blue-500"
            >
              <option value="실시간">실시간</option>
              <option value="매일 09:00">매일 09:00</option>
              <option value="매일 18:00">매일 18:00</option>
              <option value="매주 월요일">매주 월요일</option>
              <option value="매주 금요일">매주 금요일</option>
              <option value="매월 1일">매월 1일</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#1e1e1e] flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 text-sm text-gray-300 hover:bg-[#353535] rounded-lg">
            취소
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 font-medium"
          >
            <Plus size={16} />
            규칙 생성
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const RuleDetailModal = ({ rule, onClose, onDelete, onToggle, onRun }) => {
  if (!rule) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] border border-gray-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-5 border-b border-gray-800 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-white">{rule.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={clsx(
                "px-2 py-0.5 rounded text-xs font-semibold uppercase",
                rule.severity === 'critical' && "bg-red-500/20 text-red-400",
                rule.severity === 'high' && "bg-orange-500/20 text-orange-400",
                rule.severity === 'medium' && "bg-yellow-500/20 text-yellow-400",
                rule.severity === 'low' && "bg-blue-500/20 text-blue-400"
              )}>
                {rule.severity}
              </span>
              <span className={clsx(
                "px-2 py-0.5 rounded text-xs font-semibold",
                rule.status === 'active' ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
              )}>
                {rule.status === 'active' ? '활성' : '일시정지'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#404040]">
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">기본 정보</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">기반 정책</span>
                <span className="text-white font-medium">{rule.policy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">데이터 소스</span>
                <span className="text-white font-medium">{rule.dataSource}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">실행 스케줄</span>
                <span className="text-white font-medium">{rule.schedule}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">마지막 실행</span>
                <span className="text-white font-medium">{rule.lastRun || '아직 실행 안됨'}</span>
              </div>
            </div>
          </div>

          {/* 설명 */}
          {rule.description && (
            <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#404040]">
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">설명</h4>
              <p className="text-sm text-gray-300 leading-relaxed">{rule.description}</p>
            </div>
          )}

          {/* SQL 쿼리 */}
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#404040]">
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">SQL 쿼리</h4>
            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#353535]">
              <code className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                {rule.query}
              </code>
            </div>
          </div>

          {/* 실행 통계 */}
          <div className="bg-[#2a2a2a] rounded-xl p-4 border border-[#404040]">
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">실행 통계</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-[#1a1a1a] rounded-lg">
                <p className="text-xs text-gray-400 mb-1">총 위반 건수</p>
                <p className="text-2xl font-bold text-white">{rule.violations}</p>
              </div>
              <div className="text-center p-3 bg-[#1a1a1a] rounded-lg">
                <p className="text-xs text-gray-400 mb-1">알림 설정</p>
                <p className="text-lg font-bold text-white">{rule.notification ? 'ON' : 'OFF'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 bg-[#1e1e1e] flex justify-between flex-shrink-0">
          <div className="flex gap-3">
            <button
              onClick={() => {
                alert('감사 보고서가 생성됩니다.\n\n포함 내용:\n- 규칙 정보 및 SQL 쿼리\n- 실행 이력 (입력값/결과값)\n- 위반 현황 통계\n- 조치 이력\n\n형식: PDF / Excel');
              }}
              className="px-4 py-2.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
            >
              <FileBarChart size={16} />
              보고서 생성
            </button>
            <button
              onClick={() => onDelete(rule.id)}
              className="px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2"
            >
              <Trash2 size={16} />
              삭제
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onRun(rule)}
              className="px-4 py-2.5 text-sm bg-green-600 hover:bg-green-500 text-white rounded-lg flex items-center gap-2"
            >
              <Play size={16} />
              지금 실행
            </button>
            <button
              onClick={() => onToggle(rule.id)}
              className={clsx(
                "px-4 py-2.5 text-sm rounded-lg flex items-center gap-2 font-medium",
                rule.status === 'active'
                  ? "bg-gray-600 hover:bg-gray-500 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              )}
            >
              {rule.status === 'active' ? <><Power size={16} /> 일시정지</> : <><Play size={16} /> 활성화</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const UploadModal = ({ onClose, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUploadClick = () => {
    if (file) {
      onUpload(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#2a2a2a] border-2 border-[#1a1a1a] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-[#1a1a1a] flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white">소스 추가</h3>
            <p className="text-sm text-gray-400">정책 문서 또는 데이터베이스를 추가하세요</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#353535] rounded-lg text-gray-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={clsx(
              "border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer",
              isDragging ? "border-blue-500 bg-blue-500/10" : "border-[#1a1a1a] hover:border-[#404040]"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#353535] flex items-center justify-center">
                <FileUp size={32} className="text-blue-400" />
              </div>
              {file ? (
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-white font-medium">파일을 드래그하거나 클릭하여 선택하세요</p>
                  <p className="text-sm text-gray-400 mt-2">PDF, DOC, DOCX, TXT 파일 지원</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-[#1a1a1a] bg-[#1e1e1e] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-300 hover:bg-[#353535] rounded-lg">취소</button>
          <button 
            onClick={handleUploadClick}
            disabled={!file}
            className={clsx(
              "px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2",
              file ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-700 cursor-not-allowed"
            )}
          >
            <Upload size={16} />
            업로드
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DetailPanel = ({ item, type, onClose, rules, onShowCreateRule, onApproveAllRules }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [suggestedRules, setSuggestedRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);

  // 해당 정책 기반 규칙 필터링
  const relatedRules = rules.filter(rule => rule.policyId === item?.id);

  useEffect(() => {
    if (type === 'policy') {
      // AI가 제안하는 규칙들
      setTimeout(() => {
        if (item.name === '내부회계관리제도 RCM') {
          setSuggestedRules([
            {
              id: 'suggested-rcm-1',
              name: '1천만원 이상 거래 승인 미이행 감지',
              description: 'RCM 통제 7.1: 고액 거래의 승인 절차 준수 여부 확인',
              severity: 'critical',
              dataSource: 'ERP_Transaction',
              dbMatched: true,
              query: 'SELECT * FROM transactions WHERE amount > 10000000 AND approval_status = "pending"'
            },
            {
              id: 'suggested-rcm-2',
              name: '직무분리 원칙 위반 감지',
              description: 'RCM 통제 3.2: 동일인의 발주-검수-승인 수행 차단',
              severity: 'high',
              dataSource: 'ERP_Workflow',
              dbMatched: true,
              query: 'SELECT * FROM workflows WHERE requester_id = approver_id'
            },
            {
              id: 'suggested-rcm-3',
              name: '재고 실사 미이행 감지',
              description: 'RCM 통제 5.4: 분기별 재고 실사 수행 여부 확인',
              severity: 'medium',
              dataSource: 'Inventory_System',
              dbMatched: false,
              query: 'SELECT * FROM inventory_check WHERE last_check_date < DATE_SUB(NOW(), INTERVAL 90 DAY)'
            }
          ]);
        } else {
          setSuggestedRules([
            {
              id: 'suggested-1',
              name: '비밀번호 90일 미변경 감지',
              description: '90일 이상 비밀번호를 변경하지 않은 계정 탐지',
              severity: 'high',
              dataSource: 'HR_System',
              dbMatched: true,
              query: 'SELECT * FROM users WHERE password_changed_date < DATE_SUB(NOW(), INTERVAL 90 DAY)'
            },
            {
              id: 'suggested-2',
              name: '관리자 권한 무단 접근 감지',
              description: '승인되지 않은 IP에서의 관리자 접근 시도',
              severity: 'critical',
              dataSource: 'Access_Logs',
              dbMatched: true,
              query: 'SELECT * FROM access_logs WHERE role="admin" AND ip NOT IN (SELECT ip FROM approved_ips)'
            }
          ]);
        }
      }, 800);

      // 분석 후 추천 사항 생성
      setTimeout(() => {
        setRecommendations([
          {
            id: 1,
            type: 'update',
            icon: Edit2,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            title: '비밀번호 정책 강화 권장',
            description: '현재 90일 주기를 60일로 단축하면 보안성이 향상됩니다.',
            action: '정책 수정',
          },
          {
            id: 2,
            type: 'rule',
            icon: ShieldAlert,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            title: '비밀번호 미변경 감지 규칙 생성',
            description: '이 정책을 기반으로 실시간 모니터링 규칙을 생성할 수 있습니다.',
            action: '규칙 생성',
          },
          {
            id: 3,
            type: 'analysis',
            icon: FileBarChart,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            title: '기존 위반 사례 분석',
            description: '최근 3개월간 이 정책 관련 위반이 23건 발생했습니다.',
            action: '상세 보기',
          },
        ]);
      }, 500);
    }
  }, [item, type]);

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 350, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ 
        type: 'tween',
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }}
      className="flex-shrink-0 bg-[#2a2a2a] border-l-2 border-[#1a1a1a] shadow-2xl overflow-hidden flex flex-col rounded-l-2xl"
      style={{ zIndex: 10 }}
    >
      <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {type === 'policy' ? <FileText size={20} className="text-blue-400" /> : type === 'database' ? <Database size={20} className="text-green-400" /> : <Globe size={20} className="text-blue-400" />}
          <div>
            <h3 className="text-sm font-semibold text-white">{type === 'regulation' ? item.title : item.name}</h3>
            <p className="text-xs text-gray-400">{type === 'policy' ? `버전 ${item.version}` : type === 'database' ? item.type : item.source}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-[#353535] rounded-lg text-gray-400">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {type === 'policy' && (
          <>
            {/* AI 규칙 제안 섹션 */}
            {suggestedRules.length > 0 && (
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-2 border-blue-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-400 animate-pulse" />
                    <h4 className="text-sm font-semibold text-blue-300">AI 추천 규칙</h4>
                    <span className="text-xs bg-blue-500/20 px-2 py-0.5 rounded-full text-blue-300">{suggestedRules.length}개</span>
                  </div>
                  <button
                    onClick={() => {
                      const selected = suggestedRules.filter(r => selectedRules.includes(r.id) && r.dbMatched);
                      if (selected.length > 0 && onApproveAllRules) {
                        onApproveAllRules(selected, item);
                        setSuggestedRules([]);
                        setSelectedRules([]);
                      }
                    }}
                    disabled={selectedRules.length === 0}
                    className={clsx(
                      "text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors font-medium",
                      selectedRules.length > 0
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    <CheckCircle size={12} />
                    일괄 승인 ({selectedRules.length})
                  </button>
                </div>
                <div className="space-y-2">
                  {suggestedRules.map(rule => (
                    <div key={rule.id} className="bg-[#1e1e1e] rounded-lg p-3 border border-gray-700 hover:border-blue-500/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedRules.includes(rule.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRules(prev => [...prev, rule.id]);
                            } else {
                              setSelectedRules(prev => prev.filter(id => id !== rule.id));
                            }
                          }}
                          className="mt-1 w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h5 className="text-sm font-medium text-white">{rule.name}</h5>
                            <span className={clsx(
                              "text-xs px-1.5 py-0.5 rounded font-medium",
                              rule.severity === 'critical' && "bg-red-500/20 text-red-400",
                              rule.severity === 'high' && "bg-orange-500/20 text-orange-400",
                              rule.severity === 'medium' && "bg-yellow-500/20 text-yellow-400"
                            )}>
                              {rule.severity}
                            </span>
                            {!rule.dbMatched && (
                              <div className="flex items-center gap-1 text-xs bg-yellow-900/30 px-2 py-0.5 rounded text-yellow-400" title="데이터베이스를 찾을 수 없습니다. 연결이 필요합니다.">
                                <AlertTriangle size={12} />
                                <span>DB 미연결</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mb-2 leading-relaxed">{rule.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Database size={10} />
                            <span>{rule.dataSource}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-gray-400 bg-[#1e1e1e] rounded-lg p-2 border border-gray-700">
                  <div className="flex items-start gap-2">
                    <HelpCircle size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>DB 미연결 규칙은 데이터베이스 연결 후 사용 가능합니다. 채팅창에서 "Inventory_System DB 연결" 요청하세요.</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#1a1a1a]">
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">문서 정보</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">페이지</span>
                  <span className="text-white font-medium">{item.pages}페이지</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">카테고리</span>
                  <span className="text-white font-medium">{item.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">최종 수정</span>
                  <span className="text-white font-medium">{item.lastUpdated}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">상태</span>
                  <span className={clsx("font-medium", item.status === 'active' ? "text-green-400" : "text-gray-400")}>
                    {item.status === 'active' ? '활성' : '비활성'}
                  </span>
                </div>
              </div>
            </div>

            {recommendations.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">AI 추천 사항</h4>
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className={clsx("rounded-xl p-4 border", rec.bgColor, "border-[#1a1a1a]")}>
                      <div className="flex items-start gap-3 mb-2">
                        <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", rec.bgColor)}>
                          <rec.icon size={16} className={rec.color} />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-semibold text-white mb-1">{rec.title}</h5>
                          <p className="text-xs text-gray-400 leading-relaxed">{rec.description}</p>
                        </div>
                      </div>
                      <button className={clsx(
                        "w-full mt-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors",
                        "bg-[#353535] hover:bg-[#404040] text-white"
                      )}>
                        {rec.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 관련 규칙 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-gray-400 uppercase">관련 규칙 ({relatedRules.length})</h4>
                <button
                  onClick={onShowCreateRule}
                  className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-1"
                >
                  <Plus size={12} />
                  규칙 생성
                </button>
              </div>
              {relatedRules.length > 0 ? (
                <div className="space-y-2">
                  {relatedRules.map(rule => (
                    <div key={rule.id} className="bg-[#1e1e1e] rounded-xl p-3 border border-[#1a1a1a]">
                      <div className="flex items-start justify-between mb-1">
                        <h5 className="text-sm font-medium text-white">{rule.name}</h5>
                        <span className={clsx(
                          "text-xs px-1.5 py-0.5 rounded",
                          rule.status === 'active' ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                        )}>
                          {rule.status === 'active' ? '활성' : '일시정지'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{rule.schedule}</span>
                        <span>•</span>
                        <span>위반: {rule.violations}건</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#1a1a1a] text-center">
                  <p className="text-sm text-gray-400 mb-3">이 정책 기반 규칙이 아직 없습니다.</p>
                  <button
                    onClick={onShowCreateRule}
                    className="text-xs px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg inline-flex items-center gap-1"
                  >
                    <Plus size={12} />
                    첫 번째 규칙 만들기
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {type === 'regulation' && (
          <>
            {/* 외부 규제 정보 */}
            <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#1a1a1a]">
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">규제 정보</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">출처</span>
                  <span className="text-white font-medium">{item.source}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">발표일</span>
                  <span className="text-white font-medium">{item.date}</span>
                </div>
                {item.url && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">링크</span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-medium flex items-center gap-1">
                      <ExternalLink size={12} />
                      원문 보기
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* 규제 요약 */}
            {item.summary && (
              <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#1a1a1a]">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">요약</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{item.summary}</p>
              </div>
            )}

            {/* AI 추천 규칙 섹션 */}
            {item.suggestedRules && item.suggestedRules.length > 0 && (
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-2 border-blue-800/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-400 animate-pulse" />
                    <h4 className="text-sm font-semibold text-blue-300">AI 추천 규칙</h4>
                    <span className="text-xs bg-blue-500/20 px-2 py-0.5 rounded-full text-blue-300">{item.suggestedRules.length}개</span>
                  </div>
                  <button
                    onClick={() => {
                      const selected = item.suggestedRules.filter(r => selectedRules.includes(r.name));
                      if (selected.length > 0 && onApproveAllRules) {
                        onApproveAllRules(selected, item);
                        onClose();
                      }
                    }}
                    disabled={selectedRules.length === 0}
                    className={clsx(
                      "text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors font-medium",
                      selectedRules.length > 0
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    )}
                  >
                    <CheckCircle size={12} />
                    일괄 승인 ({selectedRules.length})
                  </button>
                </div>
                <div className="space-y-2">
                  {item.suggestedRules.map(rule => (
                    <div key={rule.name} className="bg-[#1e1e1e] rounded-lg p-3 border border-gray-700 hover:border-blue-500/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedRules.includes(rule.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRules(prev => [...prev, rule.name]);
                            } else {
                              setSelectedRules(prev => prev.filter(n => n !== rule.name));
                            }
                          }}
                          className="mt-1 w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h5 className="text-sm font-medium text-white">{rule.name}</h5>
                            <span className={clsx(
                              "text-xs px-1.5 py-0.5 rounded font-medium",
                              rule.severity === 'critical' && "bg-red-500/20 text-red-400",
                              rule.severity === 'high' && "bg-orange-500/20 text-orange-400",
                              rule.severity === 'medium' && "bg-yellow-500/20 text-yellow-400"
                            )}>
                              {rule.severity}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mb-2 leading-relaxed">{rule.description}</p>
                          <div className="bg-gray-900/50 rounded p-2 text-xs text-gray-400 font-mono">
                            {rule.query}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {type === 'database' && (
          <>
            <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#1a1a1a]">
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">데이터베이스 정보</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">타입</span>
                  <span className="text-white font-medium">{item.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">레코드 수</span>
                  <span className="text-white font-medium">{item.records}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">상태</span>
                  <span className="text-green-400 font-medium flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    {item.status === 'connected' ? '연결됨' : '연결 안됨'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">사용 가능한 기능</h4>
              <div className="space-y-2">
                <button className="w-full px-4 py-3 bg-[#1e1e1e] hover:bg-[#353535] rounded-xl text-left transition-colors border border-[#1a1a1a]">
                  <div className="flex items-center gap-3">
                    <Search size={16} className="text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-white">데이터 조회</p>
                      <p className="text-xs text-gray-400">데이터베이스 내용 검색</p>
                    </div>
                  </div>
                </button>
                <button className="w-full px-4 py-3 bg-[#1e1e1e] hover:bg-[#353535] rounded-xl text-left transition-colors border border-[#1a1a1a]">
                  <div className="flex items-center gap-3">
                    <ShieldAlert size={16} className="text-orange-400" />
                    <div>
                      <p className="text-sm font-medium text-white">규칙 생성</p>
                      <p className="text-xs text-gray-400">이 DB로 모니터링 규칙 만들기</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const Sidebar = ({ policies, dbs, onToggleCollapse, width, onTogglePolicy, onShowHistory, onRestore, onItemClick, onShowUpload, externalRegulations }) => {
  const [collapsedSections, setCollapsedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const isVeryCompact = width < 180;
  const isCompact = width < 250;
  const isMini = width < 100;

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 검색 필터링
  const filteredPolicies = policies.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredDbs = dbs.filter(db => 
    db.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredRegulations = externalRegulations?.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.source.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isMini) {
    return (
      <div className="bg-[#2a2a2a] border-r border-[#404040] h-full flex flex-col items-center py-4 px-2 w-full">
        <button onClick={onRestore} className="p-2 hover:bg-[#353535] rounded-lg text-blue-400 mb-4" title="패널 확대">
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#2a2a2a] h-full flex flex-col w-full overflow-hidden">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-[#1a1a1a] flex-shrink-0">
        <h2 className="text-sm font-semibold text-gray-300">소스</h2>
      </div>

      {isVeryCompact && (
        <div className="px-3 py-3 border-b border-[#404040] flex items-center justify-center bg-[#2a2a2a]">
          <button 
            onClick={onRestore}
            className="text-xs font-semibold text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <FileText size={12} />
            <span>소스</span>
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 bg-[#2a2a2a]">
        {/* Upload Button */}
        <button 
          onClick={onShowUpload}
          className="w-full mb-3 px-4 py-3 bg-transparent border-2 border-[#1a1a1a] hover:bg-[#353535] hover:border-[#404040] rounded-xl text-gray-300 hover:text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Upload size={16} />
          <span>소스 업로드</span>
        </button>

        {/* 검색창 */}
        {!isVeryCompact && (
          <div className="mb-4 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="소스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#1e1e1e] border border-[#404040] rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          {!isCompact && <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">소스 관리</h2>}
        </div>

        <div className="space-y-4">
          <div>
            {!isCompact && (
              <div 
                className="flex items-center justify-between mb-2 cursor-pointer group"
                onClick={() => toggleSection('policies')}
              >
                <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <FileText size={14} /> 업로드 파일
                  <span className="text-xs text-gray-500">({filteredPolicies.length})</span>
                </h3>
                <motion.div
                  animate={{ rotate: collapsedSections.policies ? -90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-500 group-hover:text-gray-300"
                >
                  <ChevronDown size={16} />
                </motion.div>
              </div>
            )}
            <AnimatePresence>
              {!collapsedSections.policies && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-1.5 overflow-hidden"
                >
                  {filteredPolicies.map(p => (
                <motion.li 
                  key={p.id} 
                  className="group flex items-center gap-2 text-sm px-2 py-2 rounded-lg hover:bg-[#353535] transition-colors cursor-pointer"
                  onClick={() => onItemClick(p, 'policy')}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePolicy(p.id);
                    }} 
                    className="text-gray-400 hover:text-blue-400 flex-shrink-0"
                  >
                    {p.status === 'active' ? <CheckSquare size={16} className="text-blue-500" /> : <Square size={16} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    {isVeryCompact ? (
                      <span className={clsx("truncate text-xs block", p.status !== 'active' && "text-gray-500")}>{p.name}</span>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <span className={clsx("truncate", p.status !== 'active' && "text-gray-500")}>{p.name}</span>
                        {!isCompact && <span className="text-[10px] text-gray-500 bg-gray-800 px-1.5 rounded flex-shrink-0">{p.version}</span>}
                      </div>
                    )}
                  </div>
                  {!isCompact && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onShowHistory(p);
                      }} 
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded text-gray-400 flex-shrink-0" 
                      title="버전 이력"
                    >
                      <History size={14} />
                    </button>
                  )}
                </motion.li>
              ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <div>
            {!isCompact && (
              <div 
                className="flex items-center justify-between mb-2 cursor-pointer group"
                onClick={() => toggleSection('databases')}
              >
                <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Database size={14} /> 연동된 DB
                  <span className="text-xs text-gray-500">({filteredDbs.length})</span>
                </h3>
                <motion.div
                  animate={{ rotate: collapsedSections.databases ? -90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-500 group-hover:text-gray-300"
                >
                  <ChevronDown size={16} />
                </motion.div>
              </div>
            )}
            <AnimatePresence>
              {!collapsedSections.databases && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="space-y-1.5 overflow-hidden"
                >
                  {filteredDbs.map(db => (
                <motion.li 
                  key={db.id} 
                  className="group flex items-center gap-2 text-sm px-2 py-2 rounded-lg hover:bg-[#353535] transition-colors cursor-pointer"
                  onClick={() => onItemClick(db, 'database')}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle database selection if needed
                    }} 
                    className="text-gray-400 hover:text-green-400 flex-shrink-0"
                  >
                    {db.status === 'connected' ? <CheckSquare size={16} className="text-green-500" /> : <Square size={16} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    {isVeryCompact ? (
                      <span className="truncate text-xs block text-gray-300">{db.name}</span>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-gray-300">{db.name}</span>
                        {!isCompact && <span className="text-[10px] text-gray-500 bg-gray-800 px-1.5 rounded flex-shrink-0">{db.type}</span>}
                      </div>
                    )}
                  </div>
                </motion.li>
              ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* 외부 규제 모니터링 섹션 */}
          {!isVeryCompact && filteredRegulations && filteredRegulations.length > 0 && (
            <div className="mt-4">
              {!isCompact && (
                <div 
                  className="flex items-center justify-between mb-2 cursor-pointer group"
                  onClick={() => toggleSection('regulations')}
                >
                  <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Globe size={14} /> 외부 규제 피드
                    <span className="text-xs text-gray-500">({filteredRegulations.length})</span>
                  </h3>
                  <motion.div
                    animate={{ rotate: collapsedSections.regulations ? -90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-500 group-hover:text-gray-300"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </div>
              )}
              <AnimatePresence>
                {!collapsedSections.regulations && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    {filteredRegulations.map(regulation => (
                  <motion.li 
                    key={regulation.id} 
                    className="group flex items-center gap-2 text-sm px-2 py-2 rounded-lg hover:bg-[#353535] transition-colors cursor-pointer"
                    onClick={() => onItemClick(regulation, 'regulation')}
                  >
                    {/* NEW 표시는 작은 파란색 점으로 */}
                    <div className="flex-shrink-0 w-4 flex items-center justify-center">
                      {regulation.isNew ? (
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" title="새로운 규제" />
                      ) : (
                        <div className="w-2 h-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {isVeryCompact ? (
                        <span className="truncate text-xs block text-gray-300">{regulation.title}</span>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-gray-300">{regulation.title}</span>
                          {!isCompact && regulation.suggestedRules && regulation.suggestedRules.length > 0 && (
                            <span className="text-[10px] text-green-400 bg-green-900/30 px-1.5 rounded flex-shrink-0 flex items-center gap-1">
                              <Sparkles size={10} />
                              {regulation.suggestedRules.length}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.li>
                ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const UnifiedPanel = ({ violations, rules, onFix, onToggleCollapse, width, onToggleRule, notes, onRestore, onRuleClick, onShowCreateRule, onRunRule }) => {
  const [activeTab, setActiveTab] = useState('all');
  const isVeryCompact = width < 250;
  const isCompact = width < 350;
  const isMini = width < 100;

  if (isMini) {
    return (
      <div className="bg-[#2a2a2a] border-l border-[#404040] h-full flex flex-col items-center py-4 w-full">
        <button onClick={onRestore} className="p-2 hover:bg-[#353535] rounded-lg text-gray-400 mb-4" title="패널 확대">
          <ChevronLeft size={20} />
        </button>
      </div>
    );
  }

  const STUDIO_CARDS = [
    { title: 'AI 정책 브리핑', icon: Mic, iconColor: 'text-purple-400' },
    { title: '규정 준수 요약', icon: FileCheck, iconColor: 'text-green-400' },
    { title: '정책 연관도 맵', icon: GitBranch, iconColor: 'text-pink-400' },
    { title: '감사 보고서', icon: FileText, iconColor: 'text-yellow-400' },
    { title: '컴플라이언스 체크리스트', icon: ClipboardList, iconColor: 'text-orange-400' },
    { title: '위반 사례 분석', icon: HelpCircle, iconColor: 'text-blue-400' },
    { title: '위반 통계', icon: BarChart2, iconColor: 'text-gray-400' },
    { title: '교육 자료', icon: Monitor, iconColor: 'text-gray-400' },
  ];

  return (
    <div className="bg-[#2a2a2a] h-full flex flex-col w-full overflow-hidden">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-[#1a1a1a] flex-shrink-0 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-300">통합 패널</h2>
        {!isVeryCompact && (
          <button onClick={onToggleCollapse} className="text-gray-400 hover:text-gray-300">
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {isVeryCompact && (
        <div className="px-3 py-3 border-b border-[#404040] flex items-center justify-center bg-[#2a2a2a]">
          <button 
            onClick={onRestore}
            className="text-xs font-semibold text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Layers size={12} />
            <span>통합</span>
          </button>
        </div>
      )}

      <div className="flex border-b border-[#404040] bg-[#2a2a2a] flex-shrink-0">
        {[
          { id: 'all', label: '전체', icon: Layers }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "flex-1 py-3 font-medium transition-colors border-b-2 flex items-center justify-center gap-2",
              isVeryCompact ? "text-xs" : "text-sm",
              activeTab === tab.id ? "text-blue-400 border-blue-400 bg-[#353535]" : "text-gray-400 border-transparent hover:text-gray-300 hover:bg-[#313131]"
            )}
          >
            <tab.icon size={isVeryCompact ? 12 : 14} />
            {!isVeryCompact && tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#2a2a2a]">
        <AnimatePresence mode="wait">
          {activeTab === 'all' && (
            <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 space-y-4">
              {/* AI 스튜디오 섹션 */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">AI 스튜디오</h3>
                {STUDIO_CARDS.map((card, idx) => (
                  <div key={idx} className="bg-gray-800/30 rounded-xl border border-gray-700 p-4 cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-medium text-gray-200 flex-1 min-w-0 truncate">{card.title}</h4>
                      <card.icon size={24} className={clsx(card.iconColor, "flex-shrink-0 ml-2")} />
                    </div>
                    <p className="text-sm text-gray-400">AI 도구</p>
                  </div>
                ))}
              </div>

              {/* 위반 모니터링 섹션 */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">위반 모니터링</h3>
                {violations.map(v => (
                  <div key={v.id} className="bg-gray-800/30 rounded-xl border border-gray-700 p-4 cursor-pointer hover:bg-gray-800/50 transition-colors" onClick={() => onFix(v)}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-medium text-gray-200 flex-1 min-w-0 truncate">{v.rule}</h4>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-900/50 text-red-300 flex-shrink-0 ml-2">{v.severity}</span>
                    </div>
                    <p className="text-sm text-gray-400">{v.description}</p>
                  </div>
                ))}
              </div>

              {/* 규칙 관리 섹션 */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">규칙 관리</h3>
                <button
                  onClick={onShowCreateRule}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center gap-2 font-medium transition-colors py-3 text-base"
                >
                  <Plus size={20} />
                  새 규칙 생성
                </button>

                {rules.map(rule => (
                  <div 
                    key={rule.id} 
                    className="bg-gray-800/30 rounded-xl border border-gray-700 p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                    onClick={() => onRuleClick(rule)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-medium text-gray-200 flex-1 min-w-0 truncate">{rule.name}</h4>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-900/50 text-red-300 flex-shrink-0 ml-2">
                        {rule.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">위반 {rule.violations}건 · {rule.schedule}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  const [input, setInput] = useState('');
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'intro' },
    { role: 'ai', content: '안녕하세요! RuleX입니다. 규칙 생성, 정책 관리, 위반 모니터링 등 무엇이든 물어보세요!' }
  ]);
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [dbs, setDbs] = useState(INITIAL_DBS);
  const [violations, setViolations] = useState(MOCK_VIOLATIONS);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [detailType, setDetailType] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [showRuleDetailModal, setShowRuleDetailModal] = useState(false);
  const messagesEndRef = React.useRef(null);

  const [leftPanelWidth, setLeftPanelWidth] = useState(288);
  const [rightPanelWidth, setRightPanelWidth] = useState(384);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [savedLeftWidth, setSavedLeftWidth] = useState(288);
  const [savedRightWidth, setSavedRightWidth] = useState(384);
  const [showDemoQueue, setShowDemoQueue] = useState(false);
  const [currentDemoStep, setCurrentDemoStep] = useState(0);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [autoPlayDemo, setAutoPlayDemo] = useState(false);
  const [externalRegulations, setExternalRegulations] = useState(INITIAL_EXTERNAL_REGULATIONS);

  const handleTogglePolicy = (id) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
  };

  const handleApproveRegulationRules = (approvedRules, regulation) => {
    // 새 규칙 생성
    const newRules = approvedRules.map(rule => ({
      id: Date.now() + Math.random(),
      name: rule.name,
      policy: `${regulation.title} (${regulation.source})`,
      policyId: null,
      dataSource: 'Financial_System',
      status: 'active',
      schedule: '실시간',
      violations: 0,
      severity: rule.severity,
      notification: true,
      query: rule.query,
      lastRun: null,
      description: rule.description
    }));
    
    setRules(prev => [...newRules, ...prev]);
    
    // 채팅 메시지 추가
    setMessages(prev => [...prev, {
      role: 'ai',
      id: 'approve-regulation-' + Date.now(),
      content: `✅ **${approvedRules.length}개의 규칙이 승인되어 활성화되었습니다**\n\n📋 기반 규제: ${regulation.title}\n\n${newRules.map((r, i) => `${i+1}. ${r.name} (${r.severity})`).join('\n')}\n\n우측 "통합 패널"의 규칙 관리 섹션에서 확인하실 수 있습니다.\n\n🔍 실시간 모니터링을 시작합니다...`
    }]);
    
    // NEW 뱃지 제거
    setExternalRegulations(prev => 
      prev.map(r => r.id === regulation.id ? { ...r, isNew: false } : r)
    );
  };

  const handleRestoreLeftPanel = () => {
    if (leftPanelWidth < 200) {
      setLeftPanelWidth(savedLeftWidth);
    }
  };

  const handleRestoreRightPanel = () => {
    if (rightPanelWidth < 200) {
      setRightPanelWidth(savedRightWidth);
    }
  };

  // Save panel widths when they're reasonable sizes
  React.useEffect(() => {
    if (leftPanelWidth >= 200) {
      setSavedLeftWidth(leftPanelWidth);
    }
  }, [leftPanelWidth]);

  React.useEffect(() => {
    if (rightPanelWidth >= 200) {
      setSavedRightWidth(rightPanelWidth);
    }
  }, [rightPanelWidth]);

  // 외부 규제 알림
  React.useEffect(() => {
    const newRegulationsCount = externalRegulations.filter(r => r.isNew).length;
    if (newRegulationsCount > 0) {
      const regulationsList = externalRegulations
        .filter(r => r.isNew)
        .map(r => `• ${r.title} (${r.source})`)
        .join('\n');
      
      // 초기 로딩 시에만 알림 (2초 딜레이)
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'system',
          id: 'regulation-alert-' + Date.now(),
          content: `🔔 **새로운 규제 ${newRegulationsCount}건이 등록되었습니다**\n\n${regulationsList}\n\n좌측 패널의 "외부 규제 모니터링" 섹션에서 확인하실 수 있습니다.\n\n💡 AI가 자동으로 규칙을 제안했습니다. 클릭하여 확인해보세요!`
        }]);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleItemClick = (item, type) => {
    setDetailItem(item);
    setDetailType(type);
  };

  const handleUpload = (file) => {
    // 파일 업로드 처리
    const fileName = file.name.replace(/\.[^/.]+$/, '');
    const newPolicy = {
      id: Date.now(),
      name: fileName,
      version: 'v1.0',
      type: 'pdf',
      status: 'active',
      pages: Math.floor(Math.random() * 100) + 50,
      category: '기타',
      lastUpdated: new Date().toISOString().split('T')[0],
      versions: []
    };
    setPolicies(prev => [newPolicy, ...prev]);
    
    // 분석 및 상세 패널 표시
    setTimeout(() => {
      setDetailItem(newPolicy);
      setDetailType('policy');
      setShowUploadModal(false);
      
      // 채팅에 업로드 성공 메시지 추가
      setMessages(prev => [...prev, {
        role: 'ai',
        id: 'upload-' + Date.now(),
        content: `✅ **${fileName}** 정책서가 업로드되었습니다.\n\n📄 문서 분석 완료\n- 총 ${newPolicy.pages}페이지\n- 카테고리: ${newPolicy.category}\n\n💡 좌측 정책서 상세 패널에서 AI 추천 규칙을 확인해보세요!`
      }]);
    }, 500);
  };

  const handleToggleRule = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r));
  };

  const handleCreateRule = (newRule) => {
    setRules(prev => [newRule, ...prev]);
    setMessages(prev => [...prev, {
      role: 'ai',
      content: `✅ 새로운 규칙 "${newRule.name}"이 생성되었습니다.\n\n기반 정책: ${newRule.policy}\n심각도: ${newRule.severity}\n스케줄: ${newRule.schedule}`
    }]);
  };

  const handleDeleteRule = (id) => {
    if (confirm('이 규칙을 삭제하시겠습니까?')) {
      setRules(prev => prev.filter(r => r.id !== id));
      setShowRuleDetailModal(false);
      setSelectedRule(null);
    }
  };

  const handleRunRule = (rule) => {
    setMessages(prev => [...prev, {
      role: 'ai',
      content: `🔍 규칙 "${rule.name}"을 실행 중입니다...\n\n실행 결과: ${Math.floor(Math.random() * 10)}건의 위반 사항이 발견되었습니다.`
    }]);
    
    // Update last run time
    setRules(prev => prev.map(r => 
      r.id === rule.id 
        ? { ...r, lastRun: new Date().toLocaleString('ko-KR'), violations: r.violations + Math.floor(Math.random() * 5) }
        : r
    ));
  };

  const handleApproveAllRules = (selectedRules, policy) => {
    const newRules = selectedRules.map(suggestedRule => ({
      id: Date.now() + Math.random(),
      name: suggestedRule.name,
      policy: policy.name,
      policyId: policy.id,
      dataSource: suggestedRule.dataSource,
      status: 'active',
      schedule: '실시간',
      violations: 0,
      severity: suggestedRule.severity,
      notification: true,
      query: suggestedRule.query,
      lastRun: null,
      description: suggestedRule.description
    }));

    setRules(prev => [...newRules, ...prev]);
    
    setMessages(prev => [...prev, {
      role: 'ai',
      id: 'approve-' + Date.now(),
      content: `✅ ${selectedRules.length}개의 AI 추천 규칙이 승인되어 활성화되었습니다.\n\n${newRules.map((r, i) => `${i+1}. ${r.name} (${r.severity})`).join('\n')}\n\n우측 "규칙 관리" 탭에서 확인하실 수 있습니다.\n\n🔍 실시간 모니터링을 시작합니다...`
    }]);
    
    // 3초 후 자동으로 위반 탐지 시뮬레이션
    setTimeout(() => {
      const violationCount = Math.floor(Math.random() * 3) + 1;
      setMessages(prev => [...prev, {
        role: 'ai',
        id: 'violation-detected-' + Date.now(),
        content: `🚨 **위반 사항 감지!**\n\n${newRules[0].name}에서 ${violationCount}건의 위반이 발견되었습니다.\n\n우측 "모니터링" 탭의 "위반 관리"에서 상세 내용을 확인하세요.`
      }]);
      
      // 위반 카운트 업데이트
      setRules(prev => prev.map(r => 
        r.name === newRules[0].name 
          ? { ...r, violations: violationCount, lastRun: new Date().toLocaleString('ko-KR') }
          : r
      ));
    }, 3000);
  };

  const handleRuleClick = (rule) => {
    setSelectedRule(rule);
    setShowRuleDetailModal(true);
  };

  // AI Action Helpers
  const updatePolicyVersion = (policyName, changeDescription) => {
    setPolicies(prev => prev.map(p => {
      if (p.name.includes(policyName)) {
        const newVersionNum = parseFloat(p.version.replace(/[^0-9.]/g, '')) + 0.1;
        const newVersion = `v${newVersionNum.toFixed(1)}`;
        const today = new Date().toISOString().split('T')[0];

        return {
          ...p,
          version: newVersion,
          lastUpdated: today,
          versions: [
            { version: newVersion, date: today, changes: changeDescription },
            ...p.versions
          ]
        };
      }
      return p;
    }));
  };

  const createNewRule = (ruleName, policyName, query) => {
    const newRule = {
      id: Date.now(),
      name: ruleName,
      policy: policyName,
      status: 'active',
      schedule: '실시간',
      violations: 0,
      severity: 'high',
      notification: true,
      query: query
    };
    setRules(prev => [newRule, ...prev]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    
    // Remove intro message on first user interaction and add user message
    setMessages(prev => {
      const filtered = prev.filter(m => !(m.role === 'system' && m.content === 'intro'));
      return [...filtered, userMsg];
    });
    
    // Add loading indicator
    const loadingMsg = { role: 'ai', content: 'loading', id: 'loading-' + Date.now() };
    setMessages(prev => [...prev, loadingMsg]);
    
    setInput('');

    // AI Logic Simulation
    setTimeout(() => {
      let aiResponse = { role: 'ai', content: "죄송합니다. 다시 말씀해 주시겠어요?" };

      // 1. 정책 수정 시나리오
      if (input.includes('수정') || input.includes('변경') || input.includes('업데이트')) {
        if (input.includes('비밀번호') || input.includes('보안')) {
          updatePolicyVersion('정보보안', '비밀번호 변경 주기 90일 → 60일로 단축');
          aiResponse = {
            role: 'ai',
            content: `✅ **정보보안 정책서**를 업데이트했습니다.\n\n새 버전 **v5.2**가 생성되었습니다.\n- 변경 사항: 비밀번호 변경 주기 90일 → 60일로 단축\n\n왼쪽 패널의 시계 아이콘을 클릭하여 이력을 확인해보세요.`
          };
        } else if (input.includes('ESG') || input.includes('환경')) {
          updatePolicyVersion('ESG', '2025년 탄소중립 목표 상향 조정');
          aiResponse = {
            role: 'ai',
            content: `✅ **ESG 경영 가이드라인**을 업데이트했습니다.\n\n새 버전 **2025**가 생성되었습니다.\n- 변경 사항: 2025년 탄소중립 목표 상향 조정\n\n변경된 내용은 즉시 모니터링 규칙에 반영됩니다.`
          };
        }
      }
      // 2. DB 연결 시나리오
      else if (input.includes('DB') || input.includes('데이터베이스')) {
        if (input.includes('연결')) {
          // Extract DB name from input (e.g., "Inventory_System" or "ERP_Main")
          let dbName = 'Inventory_System';
          if (input.includes('Inventory') || input.includes('재고')) {
            dbName = 'Inventory_System';
          } else if (input.includes('ERP') || input.includes('회계')) {
            dbName = 'ERP_Main';
          } else if (input.includes('HR') || input.includes('인사')) {
            dbName = 'HR_Database';
          }
          
          aiResponse = {
            role: 'ai',
            content: `✅ **${dbName}** 데이터베이스 연결을 시작합니다.\n\n**연결 정보:**\n- 서버: db.company.local:5432\n- 데이터베이스: ${dbName}\n- 스키마: public\n\n🔄 연결 중... (약 2-3초 소요)\n\n연결이 완료되면 해당 DB를 사용하는 규칙들이 활성화됩니다.`
          };
          
          // Simulate DB connection success after 2 seconds
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: 'ai',
              id: 'db-success-' + Date.now(),
              content: `✅ **${dbName}** 연결 성공!\n\n이제 이 데이터베이스를 사용하는 모든 규칙이 실시간으로 모니터링을 시작합니다.\n\n💡 좌측 패널의 정책 상세에서 DB 미연결 규칙이 활성화되었는지 확인해보세요!`
            }]);
            
            // 실제로 상세 패널의 suggestedRules에서 dbMatched를 업데이트하려면
            // DetailPanel 내부의 상태를 외부에서 업데이트할 방법이 필요
            // 여기서는 시각적 피드백만 제공
          }, 2500);
        }
      }
      // 3. 규칙 생성 시나리오
      else if (input.includes('규칙') || input.includes('모니터링') || input.includes('감시')) {
        if (input.includes('퇴사자') || input.includes('접근')) {
          createNewRule('퇴사자 시스템 접근 감지', '인사관리 사규 v2.0', 'SELECT * FROM access_logs WHERE user_id IN (SELECT id FROM employees WHERE status="retired")');
          aiResponse = {
            role: 'ai',
            content: `✅ 새로운 모니터링 규칙을 생성했습니다.\n\n**규칙명**: 퇴사자 시스템 접근 감지\n**기반 정책**: 인사관리 사규 v2.0\n**SQL**: \`SELECT * FROM access_logs WHERE user_id IN (SELECT id FROM employees WHERE status="retired")\`\n\n우측 '규칙 관리' 탭에서 확인하실 수 있습니다.`
          };
        } else if (input.includes('법인카드') || input.includes('사용')) {
          createNewRule('심야시간 법인카드 사용 감지', '내부회계관리제도 운영규정 v3.2', 'SELECT * FROM card_usage WHERE time BETWEEN "22:00" AND "06:00"');
          aiResponse = {
            role: 'ai',
            content: `✅ 새로운 모니터링 규칙을 생성했습니다.\n\n**규칙명**: 심야시간 법인카드 사용 감지\n**기반 정책**: 내부회계관리제도 운영규정 v3.2\n**SQL**: \`SELECT * FROM card_usage WHERE time BETWEEN "22:00" AND "06:00"\`\n\n이제 실시간으로 감시를 시작합니다.`
          };
        }
      }
      // 4. 일반 질의
      else {
        aiResponse = {
          role: 'ai',
          content: "정책 수정이나 규칙 생성을 원하시면 구체적으로 말씀해주세요.\n\n예시:\n- \"정보보안 정책서의 비밀번호 주기를 60일로 수정해줘\"\n- \"퇴사자가 시스템에 접근하면 알림을 주는 규칙을 만들어줘\"\n- \"Inventory_System DB 연결해줘\""
        };
      }

      const messageId = 'msg-' + Date.now();
      aiResponse.id = messageId;

      setMessages(prev => {
        // Remove loading message and add actual response
        const filtered = prev.filter(m => m.content !== 'loading');
        return [...filtered, aiResponse];
      });
      
      // Start typing animation
      setTypingMessageId(messageId);
      
      // Stop typing animation after content is fully displayed
      setTimeout(() => {
        setTypingMessageId(null);
      }, aiResponse.content.length * 20 + 500);
    }, 1500);
  };

  // Auto Demo Functions
  const startAutoDemo = () => {
    setAutoPlayDemo(true);
    setCurrentDemoStep(0);
    runDemoStep(0);
  };

  const stopAutoDemo = () => {
    setAutoPlayDemo(false);
    setIsDemoRunning(false);
  };

  const runDemoStep = (stepIndex) => {
    if (!autoPlayDemo && stepIndex > 0) return;
    
    setCurrentDemoStep(stepIndex);
    setIsDemoRunning(true);

    switch(stepIndex) {
      case 0: // 정책서 업로드
        setTimeout(() => {
          const rcmPolicy = {
            id: Date.now(),
            name: '내부회계관리제도 RCM',
            version: 'v2.1',
            type: 'pdf',
            status: 'active',
            pages: 142,
            category: '내부회계',
            lastUpdated: new Date().toISOString().split('T')[0],
            versions: []
          };
          
          // 정책이 이미 있으면 업데이트, 없으면 추가
          setPolicies(prev => {
            const existingIndex = prev.findIndex(p => p.name === '내부회계관리제도 RCM');
            if (existingIndex >= 0) {
              return prev;
            }
            return [rcmPolicy, ...prev];
          });
          
          setDetailItem(rcmPolicy);
          setDetailType('policy');
          
          setMessages(prev => [...prev, {
            role: 'ai',
            id: 'upload-auto-' + Date.now(),
            content: `✅ **내부회계관리제도 RCM** 정책서가 업로드되었습니다.\n\n📄 문서 분석 완료\n- 총 142페이지\n- 카테고리: 내부회계\n\n💡 좌측 정책서 상세 패널에서 AI 추천 규칙을 확인해보세요!`
          }]);
          
          if (autoPlayDemo) runDemoStep(1);
        }, 2000);
        break;

      case 1: // AI 규칙 일괄 승인 (DetailPanel에서 자동으로 제안되므로 승인만 시뮬레이션)
        setTimeout(() => {
          // DetailPanel의 suggestedRules를 승인하는 것을 시뮬레이션
          const rcmPolicy = policies.find(p => p.name.includes('내부회계관리제도 RCM')) || detailItem;
          
          if (rcmPolicy) {
            const suggestedRulesForApproval = [
              {
                id: 'suggested-1',
                name: '고액거래 모니터링',
                description: '100만원 이상 거래 건에 대한 실시간 모니터링',
                severity: 'critical',
                dataSource: 'Inventory_System',
                dbMatched: false,
                query: 'SELECT * FROM transactions WHERE amount > 1000000'
              },
              {
                id: 'suggested-2',
                name: '직무분리 위반 감지',
                description: '발주-검수-승인을 동일인이 수행하는지 감지',
                severity: 'high',
                dataSource: 'ERP_Main',
                dbMatched: true,
                query: 'SELECT * FROM approval_logs WHERE requester_id = approver_id'
              },
              {
                id: 'suggested-3',
                name: '재고실사 미실시 탐지',
                description: '분기별 재고실사 미실시 항목 감지',
                severity: 'medium',
                dataSource: 'Inventory_System',
                dbMatched: false,
                query: 'SELECT * FROM inventory WHERE last_audit_date < DATE_SUB(NOW(), INTERVAL 90 DAY)'
              }
            ];
            
            handleApproveAllRules(suggestedRulesForApproval.filter(r => r.dbMatched), rcmPolicy);
          }
          
          if (autoPlayDemo) setTimeout(() => runDemoStep(2), 4000);
        }, 3000);
        break;

      case 2: // 실시간 위반 탐지 (이미 handleApproveAllRules에서 자동 실행됨)
        setTimeout(() => {
          if (autoPlayDemo) runDemoStep(3);
        }, 5000);
        break;

      case 3: // DB 연결
        setTimeout(() => {
          setInput('Inventory_System DB 연결해줘');
          setTimeout(() => {
            handleSend();
            if (autoPlayDemo) setTimeout(() => runDemoStep(4), 5000);
          }, 500);
        }, 2000);
        break;

      case 4: // 위반 조치 및 보고서
        setTimeout(() => {
          // 위반 상세 모달 자동 표시
          if (violations.length > 0) {
            setSelectedViolation(violations[0]);
            
            setMessages(prev => [...prev, {
              role: 'ai',
              id: 'final-' + Date.now(),
              content: `✅ 데모 완료!\n\n**RuleX 핵심 기능:**\n- ⚡ 97% 시간 절감\n- 🤖 AI 기반 규칙 자동 생성\n- 🔍 실시간 위반 탐지 (3초 이내)\n- 📊 원클릭 감사 보고서\n\n감사합니다!`
            }]);
          }
          
          setAutoPlayDemo(false);
          setIsDemoRunning(false);
        }, 2000);
        break;

      default:
        setAutoPlayDemo(false);
        setIsDemoRunning(false);
    }
  };

  React.useEffect(() => {
    if (autoPlayDemo) {
      // Auto demo is running
    }
  }, [autoPlayDemo]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] font-sans text-gray-100 overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 border-b border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between px-6 z-20 flex-shrink-0">
        {/* Left: System Name and Panel Info */}
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">RuleX</h1>
          <div className="h-6 w-px bg-[#404040]" />
          {leftPanelWidth < 200 && (
            <button 
              onClick={handleRestoreLeftPanel}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 hover:bg-[#353535] px-3 py-1.5 rounded-lg"
            >
              <FileText size={14} />
              <span>소스 관리</span>
            </button>
          )}
          {rightPanelWidth < 200 && (
            <button 
              onClick={handleRestoreRightPanel}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 hover:bg-[#353535] px-3 py-1.5 rounded-lg"
            >
              <Sparkles size={14} />
              <span>스튜디오</span>
            </button>
          )}
        </div>
        
        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#353535] rounded-lg" title="새로고침"><RefreshCw size={18} className="text-gray-400" /></button>
          <button className="p-2 hover:bg-[#353535] rounded-lg" title="공유"><Share2 size={18} className="text-gray-400" /></button>
          <div className="h-6 w-px bg-[#404040] mx-1" />
          <button className="p-2 hover:bg-[#353535] rounded-lg relative" title="알림">
            <Bell size={18} className="text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button 
            onClick={() => setShowDemoQueue(!showDemoQueue)} 
            className={clsx(
              "p-2 hover:bg-[#353535] rounded-lg transition-colors",
              showDemoQueue && "bg-blue-600"
            )} 
            title="데모 큐"
          >
            <Settings size={18} className={showDemoQueue ? "text-white" : "text-gray-400"} />
          </button>
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden p-3 gap-3">
      <ResizablePanel side="left" width={leftPanelWidth} onResize={setLeftPanelWidth} isCollapsed={isLeftCollapsed} onToggleCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}>
        <div className="h-full bg-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col border-2 border-[#404040]">
          <Sidebar
            policies={policies}
            dbs={dbs}
            onToggleCollapse={() => setIsLeftCollapsed(true)}
            width={leftPanelWidth}
            onTogglePolicy={handleTogglePolicy}
            onShowHistory={setSelectedPolicy}
            onRestore={handleRestoreLeftPanel}
            onItemClick={handleItemClick}
            onShowUpload={() => setShowUploadModal(true)}
            externalRegulations={externalRegulations}
          />
        </div>
      </ResizablePanel>
        
      {/* Detail Panel */}
      <AnimatePresence>
        {detailItem && (
          <DetailPanel 
            item={detailItem} 
            type={detailType} 
            onClose={() => {
              setDetailItem(null);
              setDetailType(null);
            }}
            rules={rules}
            onShowCreateRule={() => setShowCreateRuleModal(true)}
            onApproveAllRules={handleApproveAllRules}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full relative min-w-0 bg-[#2a2a2a] rounded-2xl overflow-hidden border-2 border-[#404040]">
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-[#1a1a1a] flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-300">채팅</h2>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 pb-40 scrollbar-hide">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => {
              if (m.role === 'system' && m.content === 'intro') {
                return (
                  <div key={i} className="text-center space-y-6 py-12">
                    <div className="space-y-3">
                      <h1 className="text-4xl font-bold text-white">RuleX</h1>
                      <p className="text-xl text-gray-300 font-medium">AI 기반 정책 규정 관리 플랫폼</p>
                    </div>
                    <div className="max-w-2xl mx-auto space-y-4 text-gray-400">
                      <p className="text-base leading-relaxed">
                        정책 문서를 업로드하면 AI가 자동으로 분석하여 모니터링 규칙을 생성합니다.
                      </p>
                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#2a2a2a]">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                            <FileText size={20} className="text-blue-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-300">정책 분석</p>
                          <p className="text-xs text-gray-500 mt-1">문서 자동 파싱</p>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#2a2a2a]">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                            <ShieldAlert size={20} className="text-green-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-300">규칙 생성</p>
                          <p className="text-xs text-gray-500 mt-1">자연어 → SQL</p>
                        </div>
                        <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#2a2a2a]">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                            <AlertTriangle size={20} className="text-orange-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-300">위반 감지</p>
                          <p className="text-xs text-gray-500 mt-1">실시간 모니터링</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              
              if (m.content === 'loading') {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-xs">Assessing relevance...</span>
                    </div>
                  </motion.div>
                );
              }
              
              // User message - right aligned
              if (m.role === 'user') {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mb-6 flex justify-end"
                  >
                    <div className="max-w-[80%] bg-[#353535] p-4 rounded-2xl text-base leading-relaxed text-gray-100">
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  </motion.div>
                );
              }
              
              // AI responses - left aligned
              if (m.role === 'ai') {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mb-6"
                  >
                    <div className="text-base leading-relaxed text-gray-100">
                      <TypingText text={m.content} isTyping={typingMessageId === m.id} />
                    </div>
                  </motion.div>
                );
              }
              
              return null;
            })}
            </AnimatePresence>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full pt-20 opacity-50">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg" />
                </div>
                <p className="text-gray-400">정책 및 규정에 대해 무엇이든 물어보세요.</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#2a2a2a] via-[#2a2a2a] to-transparent z-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1e1e1e] border border-[#404040] rounded-[2rem] p-5 shadow-2xl relative flex flex-col gap-4">

              {/* Top Row: Input & Controls */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="입력을 시작하세요..."
                    className="w-full bg-transparent border-none text-gray-200 text-lg placeholder-gray-500 focus:ring-0 p-0 resize-none h-8 leading-8"
                    rows={1}
                  />
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 h-8">
                  <span className="text-xs text-gray-500 font-medium">
                    소스 {policies.filter(p => p.status === 'active').length}개
                    <span className="mx-1">·</span>
                    DB {INITIAL_DBS.filter(d => d.status === 'connected').length}개
                  </span>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={clsx(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      input.trim() ? "bg-white text-black hover:bg-gray-200" : "bg-[#333] text-gray-500 cursor-not-allowed"
                    )}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

              {/* Suggested Prompts (Cards) */}
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(prompt);
                      setTimeout(() => {
                        const userMsg = { role: 'user', content: prompt };
                        setMessages(prev => [...prev, userMsg]);
                        setInput('');
                        setTimeout(() => {
                          let aiResponse = { role: 'ai', content: "죄송합니다. 다시 말씀해 주시겠어요?" };
                          if (prompt.includes('정보보안')) {
                            aiResponse = { role: 'ai', content: "**정보보안 정책서 v5.1**에 따르면..." };
                          } else if (prompt.includes('ESG')) {
                            aiResponse = { role: 'ai', content: "**ESG 경영 가이드라인** 관련..." };
                          } else if (prompt.includes('내부회계')) {
                            aiResponse = { role: 'ai', content: "**내부회계관리제도** 승인 절차..." };
                          } else {
                            aiResponse = { role: 'ai', content: "**개인정보보호 지침**의 주요 내용..." };
                          }
                          setMessages(prev => [...prev, aiResponse]);
                        }, 1000);
                      }, 0);
                    }}
                    className="flex-shrink-0 w-[280px] p-4 border border-[#333] rounded-2xl text-left hover:bg-[#2a2a2a] transition-colors group"
                  >
                    <p className="text-[15px] text-gray-300 group-hover:text-white leading-relaxed font-medium">
                      {prompt}
                    </p>
                  </button>
                ))}
              </div>

            </div>
            <p className="text-center text-[11px] text-white mt-3">
              RuleX는 실수를 할 수 있습니다. 중요한 정보는 확인이 필요합니다.
            </p>
          </div>
        </div>
      </div>

      <ResizablePanel side="right" width={rightPanelWidth} onResize={setRightPanelWidth} isCollapsed={isRightCollapsed} onToggleCollapse={() => setIsRightCollapsed(!isRightCollapsed)}>
        <div className="h-full bg-[#2a2a2a] rounded-2xl overflow-hidden flex flex-col border-2 border-[#404040]">
          <UnifiedPanel
            violations={violations}
            rules={rules}
            onFix={setSelectedViolation}
            onToggleCollapse={() => setIsRightCollapsed(true)}
            width={rightPanelWidth}
            onToggleRule={handleToggleRule}
            notes={INITIAL_NOTES}
            onRestore={handleRestoreRightPanel}
            onRuleClick={handleRuleClick}
            onShowCreateRule={() => setShowCreateRuleModal(true)}
            onRunRule={handleRunRule}
          />
        </div>
      </ResizablePanel>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showDemoQueue && (
          <DemoQueuePanel 
            onClose={() => {
              setShowDemoQueue(false);
              stopAutoDemo();
            }}
            onStartAutoDemo={startAutoDemo}
            isDemoRunning={isDemoRunning}
            currentStep={currentDemoStep}
          />
        )}
        {showUploadModal && (
          <UploadModal 
            onClose={() => setShowUploadModal(false)} 
            onUpload={handleUpload}
          />
        )}
        {selectedViolation && (
          <ViolationDetailModal violation={selectedViolation} onClose={() => setSelectedViolation(null)} />
        )}
        {selectedPolicy && (
          <PolicyHistoryModal policy={selectedPolicy} onClose={() => setSelectedPolicy(null)} />
        )}
        {showCreateRuleModal && (
          <CreateRuleModal
            onClose={() => setShowCreateRuleModal(false)}
            onCreate={handleCreateRule}
            policies={policies}
            databases={dbs}
          />
        )}
        {showRuleDetailModal && selectedRule && (
          <RuleDetailModal
            rule={selectedRule}
            onClose={() => {
              setShowRuleDetailModal(false);
              setSelectedRule(null);
            }}
            onDelete={handleDeleteRule}
            onToggle={handleToggleRule}
            onRun={handleRunRule}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
