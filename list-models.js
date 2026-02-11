<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>에이닷 영어학원 인사 행정 챗봇 도입안</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root {
            --primary-navy: #003366;
            --secondary-blue: #005088;
            --accent-blue: #3B82F6;
            --bg-light: #F8FAFC;
            --text-dark: #1E293B;
            --text-muted: #64748B;
            --white: #FFFFFF;
            --success: #10B981;
            --danger: #EF4444;
        }

        * { box-sizing: border-box; }

        body {
            background-color: #E2E8F0;
            display: grid;
            gap: 40px;
            grid-template-columns: 1fr;
            margin: 0;
            min-height: 100vh;
            place-items: center;
            padding: 60px 0;
        }

        .slide-container {
            background-color: var(--white);
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            font-family: 'Noto Sans KR', sans-serif;
            height: 720px;
            overflow: hidden;
            padding: 60px;
            position: relative;
            width: 1280px;
        }

        h1, h2, h3 { font-family: 'Poppins', 'Noto Sans KR', sans-serif; margin: 0; }

        .slide-title {
            color: var(--primary-navy);
            font-size: 44px;
            font-weight: 700;
            margin-bottom: 40px;
            text-align: left;
            border-left: 8px solid var(--accent-blue);
            padding-left: 20px;
        }

        .title-layout {
            text-align: center;
            justify-content: center;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .title-layout h1 { font-size: 72px; color: var(--primary-navy); line-height: 1.2; }
        .subtitle { font-size: 26px; color: var(--text-muted); margin-top: 20px; }

        .comparison-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 20px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .comparison-table th {
            background-color: var(--primary-navy);
            color: var(--white);
            padding: 20px;
            font-size: 22px;
            text-align: center;
        }

        .comparison-table td {
            padding: 20px;
            border-bottom: 1px solid #E2E8F0;
            font-size: 19px;
            vertical-align: middle;
        }

        .comparison-table td:first-child {
            background-color: #F1F5F9;
            font-weight: 700;
            color: var(--primary-navy);
            width: 15%;
            text-align: center;
        }

        .comparison-table .asis-col { width: 42.5%; background-color: #FFF5F5; }
        .comparison-table .tobe-col { width: 42.5%; background-color: #F0FFF4; font-weight: 500; }

        .status-icon { margin-right: 10px; font-size: 20px; }

        .number-box { display: flex; align-items: center; justify-content: center; gap: 40px; }
        .number-item .number { font-size: 120px; font-weight: 700; color: var(--accent-blue); line-height: 1; }

        .timeline-container { display: flex; justify-content: space-between; position: relative; margin-top: 50px; }
        .timeline-line { position: absolute; top: 50%; left: 0; right: 0; height: 4px; background-color: var(--accent-blue); z-index: 0; }
        .timeline-item { background: var(--white); border: 3px solid var(--accent-blue); width: 240px; padding: 20px; border-radius: 12px; text-align: center; z-index: 1; }

    </style>
</head>
<body>

<!-- Slide 1: Title Slide -->
<div class="slide-container">
    <div class="title-layout">
        <h1>Gemini 기반<br>인사/행정 챗봇 도입안</h1>
        <p class="subtitle">"300명의 기다림을 5초의 확신으로" — 에이닷 DX 가속화</p>
    </div>
</div>

<!-- Slide 2: As-Is vs To-Be Comparison (Integrated) -->
<div class="slide-container">
    <h2 class="slide-title">현황 분석 및 도입 후 변화 (As-Is vs To-Be)</h2>
    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>구분</th>
                    <th style="background-color: #E53E3E;">현재 (As-Is)</th>
                    <th style="background-color: #38A169;">도입 후 (To-Be)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>대응 시간</td>
                    <td class="asis-col"><i class="fa-solid fa-circle-xmark status-icon" style="color: var(--danger);"></i>업무 시간 내 한정 (평일 09~18시)</td>
                    <td class="tobe-col"><i class="fa-solid fa-circle-check status-icon" style="color: var(--success);"></i>365일 24시간 실시간 즉시 응대</td>
                </tr>
                <tr>
                    <td>문의 채널</td>
                    <td class="asis-col"><i class="fa-solid fa-circle-xmark status-icon" style="color: var(--danger);"></i>개인 메신저/유선 (실무자 탐색 필요)</td>
                    <td class="tobe-col"><i class="fa-solid fa-circle-check status-icon" style="color: var(--success);"></i>단일화된 AI 챗봇 (셀프 서비스)</td>
                </tr>
                <tr>
                    <td>소요 시간</td>
                    <td class="asis-col"><i class="fa-solid fa-circle-xmark status-icon" style="color: var(--danger);"></i>평균 2시간 ~ 1일 (답변 대기 발생)</td>
                    <td class="tobe-col"><i class="fa-solid fa-circle-check status-icon" style="color: var(--success);"></i>평균 5초 이내 (즉시 분석 및 요약)</td>
                </tr>
                <tr>
                    <td>업무 생산성</td>
                    <td class="asis-col"><i class="fa-solid fa-circle-xmark status-icon" style="color: var(--danger);"></i>단순 반복 문의 응대로 인한 본사 부하</td>
                    <td class="tobe-col"><i class="fa-solid fa-circle-check status-icon" style="color: var(--success);"></i>고부가가치 기획 및 전략 업무 집중</td>
                </tr>
                <tr>
                    <td>정보 정확도</td>
                    <td class="asis-col"><i class="fa-solid fa-circle-xmark status-icon" style="color: var(--danger);"></i>담당자별 지식 편차 및 자료 파편화</td>
                    <td class="tobe-col"><i class="fa-solid fa-circle-check status-icon" style="color: var(--success);"></i>최신 PDF 가이드북 기반의 표준 답변</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Slide 3: Why Paid Plan? -->
<div class="slide-container">
    <h2 class="slide-title">유료 플랜 도입의 당위성</h2>
    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
            <div style="background: var(--bg-light); padding: 40px; border-radius: 20px; border-left: 10px solid var(--primary-navy);">
                <h3 style="color: var(--primary-navy); margin-bottom: 20px;"><i class="fa-solid fa-shield-halved"></i> 기업 데이터 보안</h3>
                <p>유료 API 사용 시 입력된 사내 기밀(PDF 30장)이 AI 모델 학습에 재사용되지 않음을 보장받습니다.</p>
            </div>
            <div style="background: var(--bg-light); padding: 40px; border-radius: 20px; border-left: 10px solid var(--accent-blue);">
                <h3 style="color: var(--primary-navy); margin-bottom: 20px;"><i class="fa-solid fa-gauge-high"></i> 서비스 안정성</h3>
                <p>무료 버전의 할당량 제한 없이, 300명의 구성원이 동시에 접속하더라도 빠른 응답 속도를 유지합니다.</p>
            </div>
        </div>
        <p style="margin-top: 40px; text-align: center; font-style: italic; color: var(--text-muted); font-size: 20px;">"사내 데이터의 안전한 관리와 안정적인 업무 지원을 위한 필수 투자입니다."</p>
    </div>
</div>

<!-- Slide 4: PDF Knowledge Base -->
<div class="slide-container">
    <h2 class="slide-title">PDF 30장 기반 지식 베이스 구축 (RAG)</h2>
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; align-items: center; flex-grow: 1;">
        <div style="background-color: var(--bg-light); padding: 30px; border-radius: 15px;">
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 15px 0; border-bottom: 1px solid #ddd; font-size: 22px;"><i class="fa-solid fa-file-pdf" style="color: #E11D48; margin-right: 15px;"></i>인사 규정 및 근태 관리</li>
                <li style="padding: 15px 0; border-bottom: 1px solid #ddd; font-size: 22px;"><i class="fa-solid fa-file-pdf" style="color: #E11D48; margin-right: 15px;"></i>복리후생 및 급여 지급 기준</li>
                <li style="padding: 15px 0; border-bottom: 1px solid #ddd; font-size: 22px;"><i class="fa-solid fa-file-pdf" style="color: #E11D48; margin-right: 15px;"></i>행정 처리 절차 및 문서 양식</li>
            </ul>
        </div>
        <div>
            <h3 style="color: var(--primary-navy); margin-bottom: 20px;">지능형 근거 기반 답변 프로세스</h3>
            <p style="font-size: 20px; line-height: 1.8;">
                1. 지점 구성원이 질문 입력<br>
                2. AI가 <strong>PDF 30장</strong> 내에서 관련 문구 탐색<br>
                3. 해당 원문 정보를 바탕으로 답변 생성<br>
                4. 필요시 관련 규정 페이지 및 양식 링크 안내
            </p>
        </div>
    </div>
</div>

<!-- Slide 5: Cost Estimation -->
<div class="slide-container">
    <h2 class="slide-title">월간 예상 비용 및 가성비 분석</h2>
    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
        <div class="number-box" style="margin-bottom: 40px;">
            <div class="number-item">
                <div class="number">300<span style="font-size: 40px;">명</span></div>
                <div style="font-size: 20px; font-weight: 600;">지원 대상 인원</div>
            </div>
            <div style="font-size: 60px; color: #CBD5E1;">|</div>
            <div class="number-item">
                <div class="number" style="color: var(--success);">23<span style="font-size: 40px;">만원</span></div>
                <div style="font-size: 20px; font-weight: 600;">월 운영 예상 비용</div>
            </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 20px;">
            <tr style="border-bottom: 2px solid var(--primary-navy);">
                <th style="text-align: left; padding: 15px; color: var(--primary-navy);">항목</th>
                <th style="text-align: left; padding: 15px; color: var(--primary-navy);">상세 내역</th>
                <th style="text-align: right; padding: 15px; color: var(--primary-navy);">예상 금액</th>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 15px;">Gemini API Fee</td>
                <td style="padding: 15px;">월 6,000건 질의 (인당 20건 가정)</td>
                <td style="padding: 15px; text-align: right;">약 135,000원</td>
            </tr>
            <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 15px;">Cloud Infra</td>
                <td style="padding: 15px;">Vector DB 및 중계 서버 유지</td>
                <td style="padding: 15px; text-align: right;">약 95,000원</td>
            </tr>
            <tr style="font-weight: 700; font-size: 24px;">
                <td colspan="2" style="padding: 20px; text-align: right;">월 총 운영비 (Estimated)</td>
                <td style="padding: 20px; text-align: right; color: var(--accent-blue);">약 230,000원</td>
            </tr>
        </table>
    </div>
</div>

<!-- Slide 6: Roadmap & Closing -->
<div class="slide-container">
    <h2 class="slide-title">향후 추진 일정 및 맺음말</h2>
    <div style="flex-grow: 1;">
        <div class="timeline-container">
            <div class="timeline-line"></div>
            <div class="timeline-item">
                <h3 style="font-size: 20px; color: var(--primary-navy);">1단계: 인프라 구축</h3>
                <p style="font-size: 15px; margin-top: 10px;">API 연동 및 PDF 데이터<br>학습 완료</p>
            </div>
            <div class="timeline-item">
                <h3 style="font-size: 20px; color: var(--primary-navy);">2단계: 테스트</h3>
                <p style="font-size: 15px; margin-top: 10px;">본사 내부 QA 진행 및<br>정확도 고도화</p>
            </div>
            <div class="timeline-item">
                <h3 style="font-size: 20px; color: var(--primary-navy);">3단계: 정식 배포</h3>
                <p style="font-size: 15px; margin-top: 10px;">300명 전 지점 배포 및<br>운영 개시</p>
            </div>
        </div>
        <div style="margin-top: 80px; text-align: center; background: var(--primary-navy); color: white; padding: 40px; border-radius: 20px;">
            <p style="font-size: 28px; font-weight: 700;">"본사 실무자의 시간을 확보하고 지점의 몰입도를 높이는<br>에이닷만의 지능형 업무 환경을 구축하겠습니다."</p>
        </div>
    </div>
</div>

</body>
</html>