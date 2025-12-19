# RuleX - Intelligent Policy & Data Management System

RuleX는 NotebookLM에서 영감을 받은 지능형 정책 및 데이터 관리 솔루션입니다.

## 🎯 주요 기능

1. **3가지 소스 통합 관리**
   - **업로드 파일**: PDF, DOCX 등 내부 정책 문서 업로드
   - **연동 DB**: 데이터베이스 연결 및 실시간 모니터링
   - **외부 규제 피드**: RSS/웹크롤링 기반 자동 규제 수집
   - AI 기반 소스 추천 및 검색 기능

2. **AI 기반 자연어 쿼리**
   - 정책서 내용 질의응답
   - 자동 SQL 쿼리 생성 및 실행
   - 소스 인용 및 참조 표시

3. **지능형 규칙 관리**
   - 내부 정책 기반 자동 규칙 생성
   - 외부 규제 변경 기반 AI 규칙 제안
   - 실시간 위반 사항 감지 및 알림

4. **자동 수정 & 액션**
   - AI 제안 수정 쿼리
   - Human-in-the-Loop 승인 프로세스
   - 실행 이력 추적

5. **스튜디오 AI 도구**
   - FAQ 자동 생성
   - 브리핑 문서 작성
   - 학습 가이드 생성
   - 정책 변경 타임라인
   - 메모 및 인사이트 관리

## 🚀 시작하기

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

### 빌드
```bash
npm run build
```

## 🛠️ 기술 스택

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📁 프로젝트 구조

```
RuleX/
├── src/
│   ├── App.jsx          # 메인 애플리케이션
│   ├── index.css        # 글로벌 스타일
│   └── main.jsx         # 엔트리 포인트
├── public/              # 정적 파일
├── SYSTEM_PLAN.md       # 시스템 계획서
├── FEATURE_ANALYSIS.md  # 기능 분석 문서
└── package.json
```

## 📝 문서

- [시스템 계획서](./SYSTEM_PLAN.md)
- [기능 분석](./FEATURE_ANALYSIS.md)

## 🎨 디자인

NotebookLM의 UX/UI를 참고하여 다음 요소를 구현했습니다:
- 다크 모드 테마
- 3-Pane 레이아웃 (소스 / 채팅 / 통합 패널)
- 소스별 확장/축소 및 검색 기능
- 제안된 질문 (Suggested Prompts)
- 소스 인용 표시
- 상세 정보 DetailPanel
- AI 도구 스튜디오 패널

## 📄 라이선스

MIT License
