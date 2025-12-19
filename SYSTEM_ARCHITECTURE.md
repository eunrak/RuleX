# RuleX System Architecture

## 시스템 전체 구조도

```mermaid
graph TB
    subgraph "사용자 인터페이스 (3-Panel Layout)"
        A[Left Panel<br/>소스 관리]
        B[Center Panel<br/>AI 채팅 인터페이스]
        C[Right Panel<br/>통합 패널]
    end

    subgraph "Left Panel - 소스 관리"
        A1[📤 업로드 파일<br/>PDF, DOCX, MD]
        A2[🗄️ 연동 DB<br/>실시간 연결 상태]
        A3[🌐 외부 규제 피드<br/>자동 수집]
        A4[🔍 통합 검색<br/>전체 소스 검색]
        A --> A1
        A --> A2
        A --> A3
        A --> A4
    end

    subgraph "Center Panel - AI 채팅"
        B1[💬 자연어 질의]
        B2[📊 Rich Response<br/>카드/테이블/SQL]
        B3[🔔 자동 알림<br/>신규 규제 안내]
        B --> B1
        B --> B2
        B --> B3
    end

    subgraph "Right Panel - 통합 패널"
        C1[🎨 AI 스튜디오<br/>8가지 도구]
        C2[⚠️ 위반 모니터<br/>실시간 알림]
        C3[📋 활성 규칙<br/>상태/일정 관리]
        C --> C1
        C --> C2
        C --> C3
    end

    subgraph "외부 규제 피드 시스템"
        E1[RSS 수집기<br/>80%]
        E2[웹 크롤러<br/>20%]
        E3[자동 파싱<br/>& 요약]
        E4[AI 규칙 제안<br/>엔진]
        
        E1 --> E3
        E2 --> E3
        E3 --> E4
    end

    A1 -.-> D[AI 분석 엔진]
    A2 -.-> D
    A3 -.-> D
    
    D --> B2
    E4 --> A3
    E4 --> B3
    
    B1 --> D
    D --> C3
    
    style A1 fill:#4A90E2,stroke:#2E5C8A,color:#fff
    style A2 fill:#50C878,stroke:#2E8B57,color:#fff
    style A3 fill:#9B59B6,stroke:#7D3C98,color:#fff
    style E1 fill:#E74C3C,stroke:#C0392B,color:#fff
    style E2 fill:#E67E22,stroke:#CA6F1E,color:#fff
    style E4 fill:#F39C12,stroke:#D68910,color:#fff
```

## 데이터 흐름도

```mermaid
sequenceDiagram
    participant User as 👤 사용자
    participant UI as 🖥️ UI (React)
    participant AI as 🤖 AI 엔진
    participant RSS as 📡 RSS 수집기
    participant Crawler as 🕷️ 웹 크롤러
    participant DB as 🗄️ 데이터베이스

    Note over RSS,Crawler: 백그라운드 자동 실행
    RSS->>AI: 새로운 규제 수집
    Crawler->>AI: 웹사이트 규제 크롤링
    AI->>AI: 규제 분석 & 요약
    AI->>AI: 규칙 자동 생성
    AI->>UI: 신규 규제 알림 (NEW 배지)
    
    User->>UI: 외부 규제 클릭
    UI->>UI: DetailPanel 열기
    UI-->>User: 규제 상세 + AI 제안 규칙
    
    User->>UI: 규칙 선택 & 승인
    UI->>AI: 선택된 규칙 활성화
    AI->>DB: 규칙 저장
    AI->>UI: 채팅창 알림 생성
    UI-->>User: "3개 규칙이 활성화되었습니다"
    
    loop 실시간 모니터링
        DB->>AI: 데이터 스캔
        AI->>AI: 규칙 검증
        AI->>UI: 위반 감지 시 알림
    end
```

## 소스별 상세 흐름

```mermaid
graph LR
    subgraph "1️⃣ 업로드 파일"
        U1[사용자 업로드<br/>PDF/DOCX] --> U2[파일 파싱]
        U2 --> U3[AI 분석]
        U3 --> U4[규칙 제안]
        U4 --> U5[DetailPanel<br/>표시]
    end

    subgraph "2️⃣ 연동 DB"
        D1[DB 연결 설정] --> D2[스키마 감지]
        D2 --> D3[실시간 상태<br/>모니터링]
        D3 --> D4[SQL 쿼리<br/>실행 가능]
        D4 --> D5[DetailPanel<br/>표시]
    end

    subgraph "3️⃣ 외부 규제 피드"
        R1[RSS 피드] --> R3[통합 파서]
        R2[웹 크롤링] --> R3
        R3 --> R4[AI 요약]
        R4 --> R5[규칙 자동 생성]
        R5 --> R6[NEW 배지<br/>+ 알림]
        R6 --> R7[DetailPanel<br/>표시]
    end

    U5 --> M[통합 모니터링<br/>시스템]
    D5 --> M
    R7 --> M
    
    M --> A[실시간<br/>위반 감지]
    M --> B[자동 알림]
    M --> C[수정 제안]

    style R1 fill:#E74C3C,color:#fff
    style R2 fill:#E67E22,color:#fff
    style R3 fill:#F39C12,color:#fff
    style R5 fill:#9B59B6,color:#fff
    style R6 fill:#3498DB,color:#fff
```

## 외부 규제 피드 상세 프로세스

```mermaid
flowchart TD
    Start([외부 규제 모니터링 시작]) --> Schedule[스케줄러<br/>매시간 실행]
    
    Schedule --> RSS[RSS 피드 체크<br/>5개 기관]
    Schedule --> Web[웹 크롤링<br/>3-5개 사이트]
    
    RSS --> Parse1[XML 파싱]
    Web --> Parse2[HTML 파싱]
    
    Parse1 --> Extract[데이터 추출<br/>제목/날짜/링크/내용]
    Parse2 --> Extract
    
    Extract --> Dedup[중복 제거<br/>& 필터링]
    Dedup --> NewCheck{신규 규제?}
    
    NewCheck -->|Yes| AIAnalysis[AI 분석<br/>내용 요약]
    NewCheck -->|No| End([종료])
    
    AIAnalysis --> RuleGen[규칙 자동 생성<br/>심각도 분류]
    RuleGen --> Store[(규제 데이터<br/>저장)]
    
    Store --> Notify1[UI에 NEW 배지 표시]
    Store --> Notify2[채팅창 자동 알림<br/>2초 지연]
    
    Notify1 --> UserClick{사용자<br/>클릭?}
    Notify2 --> UserClick
    
    UserClick -->|Yes| DetailPanel[DetailPanel 열기<br/>규제 상세 + AI 규칙]
    UserClick -->|No| Wait[대기 상태]
    
    DetailPanel --> Review[사용자 검토<br/>규칙 선택]
    Review --> Approve{승인?}
    
    Approve -->|Yes| Activate[규칙 활성화<br/>모니터링 시작]
    Approve -->|No| Dismiss[규제 기록만 유지]
    
    Activate --> RemoveBadge[NEW 배지 제거]
    RemoveBadge --> Monitor[실시간 모니터링<br/>위반 감지]
    
    Dismiss --> End
    Monitor --> End
    Wait --> End

    style Start fill:#2ECC71,color:#fff
    style RSS fill:#E74C3C,color:#fff
    style Web fill:#E67E22,color:#fff
    style AIAnalysis fill:#9B59B6,color:#fff
    style RuleGen fill:#F39C12,color:#fff
    style Notify1 fill:#3498DB,color:#fff
    style Notify2 fill:#3498DB,color:#fff
    style Activate fill:#27AE60,color:#fff
    style Monitor fill:#16A085,color:#fff
```

## 컴포넌트 계층 구조

```mermaid
graph TD
    App[App Component<br/>메인 애플리케이션]
    
    App --> LP[Left Panel<br/>ResizablePanel]
    App --> CP[Center Panel<br/>Chat Interface]
    App --> RP[Right Panel<br/>ResizablePanel]
    
    LP --> Sidebar[Sidebar Component]
    Sidebar --> Search[🔍 검색 입력]
    Sidebar --> Upload[📤 업로드 파일 섹션]
    Sidebar --> DB[🗄️ 연동 DB 섹션]
    Sidebar --> Reg[🌐 외부 규제 피드 섹션]
    
    Upload --> UpList[정책 문서 리스트<br/>확장/축소 가능]
    DB --> DBList[DB 연결 리스트<br/>확장/축소 가능]
    Reg --> RegList[규제 피드 리스트<br/>확장/축소 가능<br/>NEW 배지]
    
    CP --> ChatInput[메시지 입력창]
    CP --> ChatMessages[메시지 리스트<br/>User + AI + System]
    CP --> Suggestions[제안된 질문]
    
    RP --> UnifiedPanel[UnifiedPanel Component]
    UnifiedPanel --> Studio[AI 스튜디오<br/>8가지 도구]
    UnifiedPanel --> Violations[위반 목록<br/>실시간 업데이트]
    UnifiedPanel --> Rules[활성 규칙 목록<br/>상태 관리]
    
    App --> DetailPanel[DetailPanel Component<br/>조건부 렌더링]
    DetailPanel --> PolicyDetail[정책 문서 상세]
    DetailPanel --> DBDetail[DB 상세 정보]
    DetailPanel --> RegDetail[규제 상세<br/>+ AI 규칙 제안]
    
    RegDetail --> RuleCheckbox[체크박스 선택]
    RegDetail --> ApproveBtn[일괄 승인 버튼]
    
    style App fill:#2C3E50,color:#fff
    style Sidebar fill:#34495E,color:#fff
    style UnifiedPanel fill:#34495E,color:#fff
    style DetailPanel fill:#34495E,color:#fff
    style Reg fill:#9B59B6,color:#fff
    style RegList fill:#8E44AD,color:#fff
    style RegDetail fill:#8E44AD,color:#fff
```

## 기술 스택

```mermaid
graph LR
    subgraph "Frontend"
        F1[React 19.2.0]
        F2[Vite 7.2.4]
        F3[Tailwind CSS 3]
        F4[Framer Motion 12]
        F5[Lucide React Icons]
    end
    
    subgraph "State Management"
        S1[React Hooks<br/>useState/useEffect]
        S2[Component State]
        S3[Props Drilling]
    end
    
    subgraph "Future Backend (Phase 2-4)"
        B1[Node.js/Python<br/>Backend]
        B2[RSS Parser<br/>feedparser]
        B3[Web Scraper<br/>Scrapy/BeautifulSoup]
        B4[Task Scheduler<br/>Celery/node-cron]
        B5[Vector DB<br/>RAG System]
        B6[LLM API<br/>OpenAI/Claude]
    end
    
    F1 --> S1
    F2 --> F1
    F3 --> F1
    F4 --> F1
    F5 --> F1
    
    S1 --> S2
    S2 --> S3
    
    B1 --> B2
    B1 --> B3
    B1 --> B4
    B1 --> B5
    B1 --> B6
    
    B2 -.Future.-> F1
    B3 -.Future.-> F1
    B5 -.Future.-> F1

    style F1 fill:#61DAFB,color:#000
    style F2 fill:#646CFF,color:#fff
    style F3 fill:#06B6D4,color:#fff
    style F4 fill:#FF0080,color:#fff
    style B1 fill:#68A063,color:#fff
    style B5 fill:#FF6B6B,color:#fff
    style B6 fill:#10A37F,color:#fff
```

## 주요 데이터 구조

### 외부 규제 데이터 구조
```javascript
{
  id: "reg-001",
  title: "금융소비자보호법 시행령 개정안",
  source: "금융위원회",
  date: "2024-11-15",
  url: "https://fsc.go.kr/...",
  isNew: true,
  summary: "금융상품 판매 시 사전 설명 의무 강화...",
  suggestedRules: [
    {
      name: "금융상품 설명 미이행 감지",
      severity: "high",
      description: "상품 판매 전 설명 의무 준수 확인",
      query: "SELECT * FROM sales WHERE explanation_completed = false"
    }
  ]
}
```

### 규칙 데이터 구조
```javascript
{
  id: "rule-001",
  name: "90일 비밀번호 미변경 감지",
  policy: "정보보호 정책 v3.0",
  policyId: "policy-001",
  dataSource: "HR_System",
  status: "active",
  schedule: "매일 09:00",
  violations: 5,
  severity: "high",
  notification: true,
  query: "SELECT * FROM users WHERE password_changed_date < DATE_SUB(NOW(), INTERVAL 90 DAY)",
  lastRun: "2024-11-15 09:00:00",
  description: "90일 이상 비밀번호를 변경하지 않은 계정 탐지"
}
```

## 향후 로드맵

### Phase 1: UI/UX 구현 ✅ COMPLETE
- 3-Panel 레이아웃
- 소스 관리 (업로드 파일, 연동 DB, 외부 규제 피드)
- AI 채팅 인터페이스
- DetailPanel 시스템
- 검색 및 필터링
- 확장/축소 애니메이션

### Phase 2: 백엔드 RSS 수집 🔄 IN PROGRESS
- RSS 피드 파서 구현
- 5개 규제 기관 연동
- 스케줄러 설정 (매시간)
- MongoDB 데이터 저장

### Phase 3: 웹 크롤링 📅 PLANNED
- Scrapy/BeautifulSoup 구현
- 3-5개 타겟 사이트
- 에러 핸들링 및 재시도 로직
- 크롤러 상태 모니터링

### Phase 4: AI/RAG 통합 📅 PLANNED
- Vector DB 구축
- 규제 임베딩 생성
- LLM 프롬프트 엔지니어링
- 규칙 자동 생성 고도화
- Diff 분석 (규제 변경사항)

---

**문서 작성일**: 2024-12-19  
**버전**: 2.0  
**작성자**: RuleX Development Team
