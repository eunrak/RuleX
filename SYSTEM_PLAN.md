# RuleX - Intelligent Policy & Data Management System Plan

## 1. Product Vision
A "NotebookLM-inspired" intelligent workspace where users can unify company policy documents with live database connections. The system uses AI to bridge the gap between written policy (text) and technical enforcement (data rules), allowing for natural language querying, automated rule generation, and proactive violation management.

## 2. User Experience (UX) Design
Inspired by NotebookLM, the interface will be clean, document-centric, and chat-driven.

### Layout Structure
*   **Left Sidebar (Sources & Context)**:
    *   **업로드 파일 (Upload Files)**: Upload/View PDF, Docx, Markdown policy files (e.g., "IT Security Standard v2.0").
    *   **연동 DB (Connected DBs)**: Manage database connections with real-time status (e.g., "Employee DB", "Access Logs").
    *   **외부 규제 피드 (External Regulatory Feed)**: Automated RSS/web-crawled regulatory updates with AI-suggested rules.
    *   **Search & Filter**: Full-text search across all sources with expandable/collapsible sections.
    *   **Active Context**: Checkboxes to select which sources the AI should focus on for the current task.
*   **Center Stage (The "Notebook" / Chat)**:
    *   **Conversational Interface**: The primary way to interact. Users ask questions ("Who violated the password policy yesterday?") or give commands ("Create a rule for this").
    *   **Rich Responses**: AI returns not just text, but interactive cards, SQL query previews, and data tables.
    *   **Auto-Notifications**: System automatically notifies about new external regulations via chat.
*   **Right Panel (Unified Panel - Studio & Monitoring)**:
    *   **AI Studio Tools**: FAQ generation, briefings, compliance checklists, audit reports, and more.
    *   **Live Violations**: Real-time feed of policy violations detected by active rules.
    *   **Active Rules**: All monitoring rules with status, schedule, and violation counts.
    *   **Action Queue**: Pending remediation actions requiring user approval.

## 3. Core Features

### (1) Multi-Source Integration
*   **업로드 파일 (Upload Files)**: 
    *   Drag-and-drop policy documents (PDF, DOCX, Markdown).
    *   Version history tracking and status management (active/inactive).
    *   AI-powered analysis to suggest relevant monitoring rules.
*   **연동 DB (Connected DBs)**: 
    *   Simple form to add database connection strings.
    *   Real-time connection status indicators.
    *   Automatic schema detection and table mapping.
*   **외부 규제 피드 (External Regulatory Feed)**:
    *   Hybrid monitoring: RSS feeds (80%) + web crawling (20%).
    *   Automatic content parsing and summarization.
    *   AI-generated rule suggestions based on regulatory changes.
    *   NEW badge indicators for recently collected regulations.
*   **Smart Search**: Full-text search across all three source types with real-time filtering.
*   **Expandable Sections**: Collapsible source categories with smooth animations for better UX.

### (2) AI-Powered Querying & Rule Generation
*   **Natural Language to SQL**: User asks "Show me users who haven't changed passwords in 90 days." -> AI generates SQL -> Runs against mock DB -> Shows results.
*   **Policy-to-Rule**: User asks "Create a monitoring rule based on Section 4.2 of the Security Policy." -> AI extracts the logic -> Proposes a scheduled SQL check.
*   **Regulation-to-Rule**: When new external regulations are detected:
    *   AI automatically analyzes regulatory changes.
    *   Suggests monitoring rules with severity levels (critical/high/medium).
    *   Users can review and approve rules via DetailPanel.
    *   Approved rules are instantly activated and added to monitoring dashboard.
*   **Multi-Rule Approval**: Checkbox-based selection for batch approval of AI-suggested rules.

### (3) Violation Monitoring & Alerts
*   **Auto-Scan**: Scheduled runs of generated rules.
*   **Smart Alerts**: Notifications that explain *why* it's a violation, citing the specific policy section.

### (4) Remediation & Action
*   **Action Queries**: AI proposes `UPDATE` or `DELETE` queries to fix issues (e.g., "Disable account for user X").
*   **Human-in-the-Loop**: User must review and click "Execute" to run the action.

### (5) DetailPanel System
*   **Unified Detail View**: Clicking any source (upload file, DB, or regulation) opens a consistent DetailPanel on the right.
*   **Context-Aware Content**:
    *   **Upload Files**: Document info, AI-suggested rules based on policy content, related active rules.
    *   **Connected DBs**: Database info, schema details, available actions (query, create rule).
    *   **External Regulations**: Regulation summary, source info, AI-suggested compliance rules with SQL queries.
*   **Interactive Actions**: 
    *   Checkbox selection for multi-rule approval.
    *   One-click rule activation.
    *   External link to original regulation source.
*   **Smooth Animations**: Framer Motion-powered slide-in/out transitions.

## 4. Technical Architecture (Demo Version)
*   **Frontend**: React 19.2.0 (Vite 7.2.4) + Tailwind CSS 3 + Framer Motion 12 (for premium animations).
*   **State Management**: React Hooks (useState, useEffect) with component-level state management.
*   **Icons**: Lucide React for consistent iconography.
*   **Mocking**:
    *   **AI Simulation**: Pre-scripted or heuristic-based responses to demonstrate the flow without a live LLM backend for the initial demo.
    *   **Database**: In-memory JSON data to simulate SQL queries and results.
    *   **External Regulations**: Mock data structure simulating RSS/web-crawled content with AI-suggested rules.
*   **Key Components**:
    *   **Sidebar**: Source management with search, filtering, and expandable sections.
    *   **DetailPanel**: Contextual detail view for all source types with AI rule suggestions.
    *   **UnifiedPanel**: Integrated AI Studio, violations monitor, and rules dashboard.
    *   **Chat Interface**: Natural language interaction with AI assistant.

## 5. Implementation Steps
1.  **Scaffold Project**: Setup React+Vite+Tailwind. ✅ COMPLETE
2.  **Design System**: Define the "Notebook" aesthetic (clean typography, glassmorphism, subtle borders). ✅ COMPLETE
3.  **Build Layout**: Implement the 3-pane responsive layout with resizable panels. ✅ COMPLETE
4.  **Develop Core Features**: ✅ COMPLETE
    *   Source Manager with 3 source types (Upload Files, Connected DBs, External Regulatory Feed).
    *   Search and filter functionality across all sources.
    *   Expandable/collapsible sections with animations.
    *   Chat Interface with AI assistant.
    *   UnifiedPanel combining AI Studio + Violations + Rules.
    *   DetailPanel system for contextual source details.
5.  **Advanced Features**: ✅ COMPLETE (Phase 1)
    *   External regulations monitoring with NEW badges.
    *   AI-suggested rules from regulatory changes.
    *   Multi-rule approval workflow.
    *   Auto-notification system for new regulations.
6.  **Script Demo Scenario**: Hardcode a compelling flow (Upload Policy -> Ask Question -> Generate Rule -> Monitor External Regulations -> Approve AI Rules -> Fix Violation). ✅ COMPLETE
7.  **Future Phases**: 🕐 PENDING
    *   Phase 2: Backend RSS collector implementation.
    *   Phase 3: Web scraper for non-RSS regulatory sites.
    *   Phase 4: RAG integration for advanced rule generation.
