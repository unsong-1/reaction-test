/**
 * 반응 테스트 (Reaction Test Suite) - 6종 멀티 모드 고도화판
 * 순수 바닐라 JavaScript + Web Audio API + LocalStorage + Chart.js
 */

// ==========================================
// 1. 모드 정의 및 상태 상수
// ==========================================
const TEST_MODES = {
  'green-light': {
    id: 'green-light',
    name: '초록불 반응',
    badge: '클래식',
    icon: 'zap',
    accentColor: '#10b981',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    desc: '화면이 초록색으로 바뀌는 순간, 최대한 빠르게 클릭하세요.',
    controls: '마우스 클릭 또는 Spacebar'
  },
  'color-match': {
    id: 'color-match',
    name: '색상 구분',
    badge: '선택 반응',
    icon: 'palette',
    accentColor: '#ec4899',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    desc: '색상 버튼을 확인하고, 목표 색상이 제시되면 해당 버튼을 빠르게 누르세요.',
    controls: '목표 색상 버튼 터치/클릭'
  },
  'direction': {
    id: 'direction',
    name: '방향 반응',
    badge: '방향 인지',
    icon: 'compass',
    accentColor: '#0ea5e9',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    desc: '화살표 선택지를 확인하고, 목표 방향이 나타나면 즉시 입력하세요.',
    controls: '방향키(↑ ↓ ← →) 또는 화면 화살표 터치'
  },
  'position': {
    id: 'position',
    name: '위치 조준',
    badge: '타겟 에임',
    icon: 'crosshair',
    accentColor: '#f59e0b',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    desc: '검은 화면에서 무작위 위치에 타겟 원이 나타나는 순간 빠르게 클릭하세요.',
    controls: '나타난 타겟 직접 클릭'
  },
  'shape': {
    id: 'shape',
    name: '도형 반응',
    badge: '도형 인지',
    icon: 'shapes',
    accentColor: '#a855f7',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    desc: '도형 버튼을 확인하고, 목표 도형이 제시되면 해당 버튼을 빠르게 누르세요.',
    controls: '목표 도형 버튼 터치/클릭'
  },
  'audio': {
    id: 'audio',
    name: '소리 반응',
    badge: '청각 반응',
    icon: 'volume-2',
    accentColor: '#6366f1',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    desc: '사전 샘플 소리를 인지한 후, 목표 소리가 들리는 즉시 클릭하세요. (시각 신호 없음)',
    controls: '마우스 클릭 또는 Spacebar'
  },
  'hold-release': {
    id: 'hold-release',
    name: '홀드 반응',
    badge: '누르고 떼기',
    icon: 'hand',
    accentColor: '#06b6d4',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    desc: '신호가 뜨면 즉시 누르고(Hold), 신호가 바뀌면 즉시 손을 떼세요(Release).',
    controls: '신호 시 누른 채 유지 ➔ 신호 변경 시 떼기'
  },
  'dual-stimuli': {
    id: 'dual-stimuli',
    name: '동시 자극',
    badge: '듀얼 싱크',
    icon: 'layers',
    accentColor: '#14b8a6',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    desc: '화면 좌우 2개의 자극 영역이 동시에 켜지는 순간, 최대한 빠르게 클릭하세요.',
    controls: '마우스 클릭 또는 Spacebar'
  },
  'inverted-direction': {
    id: 'inverted-direction',
    name: '순서 반전',
    badge: '청개구리',
    icon: 'repeat',
    accentColor: '#e11d48',
    badgeClass: 'bg-rose-600/20 text-rose-300 border-rose-600/30',
    desc: '제시된 방향의 정반대 방향(↑면 ↓, ←면 →)을 빠르게 입력하세요.',
    controls: '반대 방향키(↑ ↓ ← →) 또는 반대 화살표 터치'
  },
  'signal-offset': {
    id: 'signal-offset',
    name: '신호 종료',
    badge: '소등 반응',
    icon: 'eye-off',
    accentColor: '#64748b',
    badgeClass: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    desc: '지속해서 켜져 있던 신호가 꺼지는(소등) 순간, 최대한 빠르게 클릭하세요.',
    controls: '마우스 클릭 또는 Spacebar'
  },
  'expansion-timing': {
    id: 'expansion-timing',
    name: '압력 타이밍',
    badge: '원 확장 타이밍',
    icon: 'disc',
    accentColor: '#eab308',
    badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    desc: '커지는 원이 목표 링(가이드 테두리)에 정확히 닿는 순간을 맞춰 클릭하세요.',
    controls: '목표 크기 정합 순간 클릭 또는 Spacebar'
  },
  'rapid-number': {
    id: 'rapid-number',
    name: '숫자 출현',
    badge: '숫자 포착',
    icon: 'hash',
    accentColor: '#3b82f6',
    badgeClass: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
    desc: '빠르게 교체되는 숫자들 중 목표 숫자가 나타나는 순간 즉시 클릭하세요.',
    controls: '목표 숫자 등장 시 클릭 또는 Spacebar'
  },
  'random': {
    id: 'random',
    name: '랜덤 모드',
    badge: '무작위 모드',
    icon: 'shuffle',
    accentColor: '#f43f5e',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    desc: '12가지 반응 테스트 중 설정된 반복 횟수만큼 매 회차 무작위로 추첨되어 배정됩니다.',
    controls: '각 회차 추첨 테스트 조작법에 따름'
  },
  'custom-sequence': {
    id: 'custom-sequence',
    name: '지정 모드',
    badge: '지정 순서',
    icon: 'list-ordered',
    accentColor: '#8b5cf6',
    badgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    desc: '직접 지정한 12종 테스트 순서대로 설정된 횟수만큼 연속 진행됩니다.',
    controls: '각 회차 지정 테스트 조작법에 따름'
  }
};

const STATES = {
  IDLE: 'IDLE',                   // 시작 전 대기 화면
  WAITING: 'WAITING',             // 준비 및 무작위 대기 상태
  DECOY: 'DECOY',                 // (어려움 전용) 가짜 색상 착시 플래시
  READY_TO_CLICK: 'READY_TO_CLICK', // 목표 자극 제시 및 측정 단계
  EARLY_CLICK: 'EARLY_CLICK',     // 조기 클릭/입력 경고 상태
  MISSED: 'MISSED',               // 오답 또는 시간 초과 상태
  ROUND_RESULT: 'ROUND_RESULT',   // 회차별 단일 결과 상태
  PAUSED: 'PAUSED',               // 일시정지 상태
  SUMMARY: 'SUMMARY'              // 완료 종합 결과 화면
};

// 기본 설정 및 현재 설정
const DEFAULT_SETTINGS = {
  totalRounds: 5,        // 5, 10, 20
  minWaitSec: 1.0,       // 0.5 ~ 4.0 초
  maxWaitSec: 5.0        // 1.5 ~ 8.0 초
};

// 랜덤 및 지정 모드용 12종 전체 테스트 풀
const MULTI_MODE_POOL = [
  'green-light', 'color-match', 'direction', 'position', 'shape', 'audio',
  'hold-release', 'dual-stimuli', 'inverted-direction', 'signal-offset', 'expansion-timing', 'rapid-number'
];


// ==========================================
// ensureCustomSequenceLength: 지정 모드 순서 배열 길이를 totalRounds에 맞춤
// ==========================================
function ensureCustomSequenceLength(length) {
  while (customSequence.length < length) {
    customSequence.push(MULTI_MODE_POOL[customSequence.length % MULTI_MODE_POOL.length]);
  }
  if (customSequence.length > length) {
    customSequence = customSequence.slice(0, length);
  }
}
let currentSettings = { ...DEFAULT_SETTINGS };
let currentMode = 'green-light';
let currentCategory = 'single';      // 'single' | 'random' | 'custom-sequence'
let lastSingleMode = 'green-light';  // 개별 모드 마지막 선택 기억
let activeRoundMode = 'green-light'; // 현재 회차에서 실제 구동되는 세부 테스트 모드
let customSequence = ['green-light', 'color-match', 'direction', 'position', 'shape']; // 지정 모드 5회차 순서 (기본값)
let randomSequence = [];             // 랜덤 모드 5회차 무작위 배정 리스트
let isAudioTargetPlaying = false;    // 소리 반응 테스트에서 실제 사운드 출력 진행 여부
let isProceedingRound = false;       // 전환 화면에서 중복 진행 방지 가드 플래그

// [신규 모드 전용 상태 변수들]
// 1. 홀드 반응 (hold-release)
let holdPhase = 'idle'; // 'idle' | 'waiting' | 'ready-to-press' | 'holding' | 'ready-to-release' | 'done'
let holdPressStartTime = 0;
let holdPressReactionTime = 0;
let holdReleaseStartTime = 0;
let holdReleaseReactionTime = 0;
let holdSignalTimeoutId = null;
let holdReleaseTimeoutId = null;
let holdIsHeld = false;

// 2. 압력 타이밍 (expansion-timing)
let expansionAnimFrameId = null;
let expansionTargetRadius = 110;
let expansionCurrentRadius = 15;
let expansionAnimStartTime = 0;
let expansionDurationMs = 1200;
let expansionTargetHitTime = 0;

// 3. 숫자 출현 (rapid-number)
let rapidNumberIntervalId = null;
let rapidNumberTimeoutId = null;
let rapidTargetNumber = 0;
let rapidCurrentNumber = 0;
let rapidTargetAppearTime = 0;
let rapidIsTargetActive = false;
let rapidStreamNumbers = [];
let rapidStreamIndex = 0;

// 4. 동시 자극 (dual-stimuli - 독립 점멸 및 동시 점등 제어)
let dualStateA = false;
let dualStateB = false;
let dualIsSimultaneous = false;
let dualTimerA = null;
let dualTimerB = null;
let dualSyncTimeoutId = null;
let dualTimeoutId = null;

// 5. 신호 종료 (signal-offset - 불규칙 밝기 및 완전 소등 제어)
let signalOffsetFlickerTimeoutId = null;
let signalOffsetFadeTimeoutId = null;
let signalOffsetTimeoutId = null;
let signalOffsetExtinguished = false;

let currentState = STATES.IDLE;
let previousState = STATES.IDLE;
let currentRound = 1;
let roundResults = []; // [ms, ms, ...] (하위 호환 배열)
let roundDetails = []; // [{ round, mode, reactionTime, isCorrect }, ...]
let roundSuccessCount = 0; // 정상 정답 횟수
let falseStarts = 0;   // 조기 클릭 또는 오답 누적 횟수
let startTime = 0;

// 모드별 라운드 문제 데이터
let modeQuestionData = null;

// 타이머 핸들러 및 시간 측정
let waitTimeoutId = null;
let decoyTimeoutId = null;
let missedTimeoutId = null;
let waitStartTime = 0;
let targetWaitDuration = 0;
let remainingWaitDuration = 0;
let lastRoundResultData = null;

let soundEnabled = true;
let testHistory = [];       // 누적 테스트 세션 데이터
let historyFilter = 'all';  // 히스토리 필터 ('all' 또는 testType)

// Chart.js 인스턴스 보관
let summaryChartInstance = null;
let historyTrendChartInstance = null;
let modeCompareChartInstance = null;

// ==========================================
// 2. DOM 요소 참조
// ==========================================
const testArea = document.getElementById('testArea');
const testContent = document.getElementById('testContent');
const roundProgressWrapper = document.getElementById('roundProgressWrapper');
const playCategoryTabs = document.getElementById('playCategoryTabs');
const roundIndicator = document.getElementById('roundIndicator');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('statusText');
const pauseBtn = document.getElementById('pauseBtn');
const resultDashboard = document.getElementById('resultDashboard');

const modeSelector = document.getElementById('modeSelector');
const modeGuideBanner = document.getElementById('modeGuideBanner');
const guideModeBadge = document.getElementById('guideModeBadge');
const guideModeDesc = document.getElementById('guideModeDesc');
const guideModeControls = document.getElementById('guideModeControls');

const headerRoundBadge = document.getElementById('headerRoundBadge');
if (headerRoundBadge) {
  headerRoundBadge.addEventListener('click', () => {
    openSettingsModal();
  });
}
const pbBadge = document.getElementById('pbBadge');
const pbValue = document.getElementById('pbValue');
const pbBadgeMobile = document.getElementById('pbBadgeMobile');
const pbValueMobile = document.getElementById('pbValueMobile');

// 헤더 액션 버튼들
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIcon = document.getElementById('soundIcon');
const settingsBtn = document.getElementById('settingsBtn');
const analyticsBtn = document.getElementById('analyticsBtn');
const helpBtn = document.getElementById('helpBtn');
const openResetFromFooterBtn = document.getElementById('openResetFromFooterBtn');

// 모달 요소들
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const minWaitInput = document.getElementById('minWaitInput');
const maxWaitInput = document.getElementById('maxWaitInput');
const minWaitVal = document.getElementById('minWaitVal');
const maxWaitVal = document.getElementById('maxWaitVal');
const waitRangeLabel = document.getElementById('waitRangeLabel');
const roundOptionBtns = document.querySelectorAll('.round-option-btn');

const analyticsModal = document.getElementById('analyticsModal');
const closeAnalyticsBtn = document.getElementById('closeAnalyticsBtn');
const closeAnalyticsBottomBtn = document.getElementById('closeAnalyticsBottomBtn');
const tabHistoryBtn = document.getElementById('tabHistoryBtn');
const tabChartsBtn = document.getElementById('tabChartsBtn');
const tabContentHistory = document.getElementById('tabContentHistory');
const tabContentCharts = document.getElementById('tabContentCharts');
const historyListContainer = document.getElementById('historyListContainer');
const historyCountText = document.getElementById('historyCountText');
const clearAllHistoryBtn = document.getElementById('clearAllHistoryBtn');


const resetConfirmModal = document.getElementById('resetConfirmModal');
const cancelResetBtn = document.getElementById('cancelResetBtn');
const confirmResetBtn = document.getElementById('confirmResetBtn');

const quitConfirmModal = document.getElementById('quitConfirmModal');
const cancelQuitBtn = document.getElementById('cancelQuitBtn');
const confirmQuitBtn = document.getElementById('confirmQuitBtn');
const quitModalDesc = document.getElementById('quitModalDesc');

const helpModal = document.getElementById('helpModal');
const closeHelpBtn = document.getElementById('closeHelpBtn');
const confirmHelpBtn = document.getElementById('confirmHelpBtn');

// ==========================================
// 3. Web Audio API 사운드 신시사이저
// ==========================================
class SoundManager {
  constructor() {
    this.ctx = null;
    this.activeTargetOsc = null;
    this.activeTargetGain = null;
    this.activeTargetTimeout = null;
  }

  async init() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return this.ctx;
    } catch (e) {
      console.warn('AudioContext initialization error:', e);
      return null;
    }
  }

  playTone(freq, type, duration, gainValue = 0.15) {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  playReady() {
    this.playTone(440, 'sine', 0.08, 0.1);
  }

  playGo() {
    this.playTone(880, 'sine', 0.15, 0.22);
  }

  playDecoy() {
    this.playTone(330, 'triangle', 0.08, 0.12);
  }

  playSuccess() {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [659.25, 880]; // E5 -> A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.16, 0.15);
      }, idx * 70);
    });
  }

  playFail() {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  playPause() {
    this.playTone(520, 'sine', 0.12, 0.12);
  }

  // 기존 재생 중인 목표 사운드 노드 즉시 중단 및 리셋 (연타 시 겹침/소리 깨짐 방지)
  stopActiveTargetSound() {
    if (this.activeTargetTimeout) {
      clearTimeout(this.activeTargetTimeout);
      this.activeTargetTimeout = null;
    }
    if (this.activeTargetOsc) {
      try {
        this.activeTargetOsc.stop();
        this.activeTargetOsc.disconnect();
      } catch (e) {
        // 이미 중지되었거나 연결 해제된 경우 안전하게 무시
      }
      this.activeTargetOsc = null;
    }
    if (this.activeTargetGain) {
      try {
        this.activeTargetGain.disconnect();
      } catch (e) {
        // 무시
      }
      this.activeTargetGain = null;
    }
  }

  /**
   * 사전 청취와 실제 측정 단계에서 100% 동일하게 공유하는 단일 목표 오디오 출력 함수
   * @returns {Promise<number>} 소리 재생이 시작된 정확한 performance.now() 타임스탬프 반환
   */
  async playTargetSound() {
    // 1. AudioContext 초기화 및 suspended 상태 해제 (User Gesture 이벤트 루프 내)
    await this.init();
    if (!this.ctx) {
      const err = new Error('Web Audio API가 지원되지 않거나 활성화할 수 없습니다.');
      console.error(err);
      throw err;
    }

    // 2. 버튼 연속 클릭 시 기존 재생 노드 즉시 stop/reset하여 소리 겹침 및 왜곡 방지
    this.stopActiveTargetSound();

    try {
      const currentTime = this.ctx.currentTime;
      const duration = 0.25; // 250ms

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, currentTime);

      // Attack & Decay 볼륨 설정 (깨끗하고 선명한 톤)
      gain.gain.setValueAtTime(0.3, currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      this.activeTargetOsc = osc;
      this.activeTargetGain = gain;

      // 소리 출력이 실제로 시작되는 정밀 타임스탬프 캡처
      const exactStartTime = performance.now();
      osc.start(currentTime);
      osc.stop(currentTime + duration);

      this.activeTargetTimeout = setTimeout(() => {
        this.stopActiveTargetSound();
      }, duration * 1000 + 40);

      return exactStartTime;
    } catch (err) {
      console.error('playTargetSound failed:', err);
      this.stopActiveTargetSound();
      throw err;
    }
  }

  // 사전 청취용 메서드 (공통 playTargetSound 호출)
  async playAudioSample() {
    return this.playTargetSound();
  }

  // 실제 측정용 메서드 (공통 playTargetSound 호출)
  async playAudioTarget() {
    return this.playTargetSound();
  }

  playCelebrate() {
    if (!soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.3, 0.2);
      }, idx * 110);
    });
  }
}

const sounds = new SoundManager();

// ==========================================
// 4. 로컬 스토리지 (LocalStorage) 관리
// ==========================================
function loadStorage() {
  try {
    const savedSound = localStorage.getItem('reaction_sound_enabled');
    if (savedSound !== null) {
      soundEnabled = savedSound === 'true';
    }
  } catch (e) {
    console.warn('LocalStorage error (sound):', e);
  }
  updateSoundIcon();

  try {
    const savedCat = localStorage.getItem('reaction_category');
    if (savedCat === 'single' || savedCat === 'random' || savedCat === 'custom-sequence') {
      currentCategory = savedCat;
    }
  } catch (e) {
    console.warn('LocalStorage error (category):', e);
  }

  try {
    const savedSeq = localStorage.getItem('reaction_custom_sequence');
    if (savedSeq) {
      const parsedSeq = JSON.parse(savedSeq);
      if (Array.isArray(parsedSeq) && parsedSeq.length === 5) {
        customSequence = parsedSeq;
      }
    }
  } catch (e) {
    console.warn('LocalStorage error (sequence):', e);
  }

  try {
    const savedMode = localStorage.getItem('reaction_current_mode');
    if (savedMode && TEST_MODES[savedMode]) {
      currentMode = savedMode;
      if (savedMode !== 'random' && savedMode !== 'custom-sequence') {
        lastSingleMode = savedMode;
      }
    }
  } catch (e) {
    console.warn('LocalStorage error (mode):', e);
  }

  if (currentCategory === 'random') {
    currentMode = 'random';
  } else if (currentCategory === 'custom-sequence') {
    currentMode = 'custom-sequence';
  } else {
    currentCategory = 'single';
    currentMode = lastSingleMode || 'green-light';
  }

  try {
    const savedSettings = localStorage.getItem('reaction_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      currentSettings = { ...DEFAULT_SETTINGS, ...parsed };
      delete currentSettings.difficulty;
    }
  } catch (e) {
    console.warn('LocalStorage error (settings):', e);
  }

  ensureCustomSequenceLength(currentSettings.totalRounds);

  try {
    const savedHistory = localStorage.getItem('reaction_history');
    if (savedHistory) {
      testHistory = JSON.parse(savedHistory);
      if (!Array.isArray(testHistory)) testHistory = [];
    }
  } catch (e) {
    console.warn('LocalStorage error (history):', e);
    testHistory = [];
  }

  updateCategoryTabsUI();
  updatePBDisplay();
  applySettingsToUI();
  updateModeTabsUI();
}

function getModeBestAvg(modeId) {
  try {
    const saved = localStorage.getItem(`reaction_best_session_avg_${modeId}`);
    if (saved !== null) {
      const val = parseInt(saved, 10);
      return isNaN(val) ? null : val;
    }
    if (modeId === 'green-light') {
      const legacy = localStorage.getItem('reaction_best_session_avg');
      if (legacy !== null) {
        const val = parseInt(legacy, 10);
        return isNaN(val) ? null : val;
      }
    }
  } catch (e) {}
  return null;
}

function saveModeBestAvg(modeId, newScore) {
  const currentBest = getModeBestAvg(modeId);
  if (currentBest === null || newScore < currentBest) {
    try {
      localStorage.setItem(`reaction_best_session_avg_${modeId}`, newScore.toString());
      if (modeId === 'green-light') {
        localStorage.setItem('reaction_best_session_avg', newScore.toString());
      }
    } catch (e) {}
    updatePBDisplay();
    return true;
  }
  return false;
}

function updatePBDisplay() {
  const bestVal = getModeBestAvg(currentMode);
  if (bestVal !== null) {
    pbValue.textContent = `${bestVal} ms`;
    pbValueMobile.textContent = `${bestVal} ms`;
    pbBadge.classList.remove('hidden');
    pbBadge.classList.add('md:flex');
    pbBadgeMobile.classList.remove('hidden');
    pbBadgeMobile.classList.add('flex');
  } else {
    pbValue.textContent = `-- ms`;
    pbValueMobile.textContent = `-- ms`;
    pbBadge.classList.add('hidden');
    pbBadge.classList.remove('md:flex');
    pbBadgeMobile.classList.add('hidden');
    pbBadgeMobile.classList.remove('flex');
  }
}

function saveSessionResult(sessionData) {
  testHistory.unshift(sessionData);
  if (testHistory.length > 60) {
    testHistory = testHistory.slice(0, 60);
  }

  try {
    localStorage.setItem('reaction_history', JSON.stringify(testHistory));
  } catch (e) {
    console.warn('LocalStorage save error (history):', e);
  }

  const isNewPb = saveModeBestAvg(sessionData.testType, sessionData.avgTime);
  return isNewPb;
}

function clearAllData() {
  testHistory = [];
  try {
    localStorage.removeItem('reaction_history');
    localStorage.removeItem('reaction_best_session_avg');
    localStorage.removeItem('reaction_best_score');
    Object.keys(TEST_MODES).forEach(m => {
      localStorage.removeItem(`reaction_best_session_avg_${m}`);
    });
  } catch (e) {
    console.warn('LocalStorage clear error:', e);
  }
  updatePBDisplay();
  renderHistoryList();
  renderCharts();
}

function updateSoundIcon() {
  if (soundEnabled) {
    soundIcon.setAttribute('data-lucide', 'volume-2');
    soundToggleBtn.classList.remove('text-rose-400');
    soundToggleBtn.classList.add('text-slate-300');
    soundToggleBtn.title = '효과음 끄기';
  } else {
    soundIcon.setAttribute('data-lucide', 'volume-x');
    soundToggleBtn.classList.remove('text-slate-300');
    soundToggleBtn.classList.add('text-rose-400');
    soundToggleBtn.title = '효과음 켜기';
  }
  if (window.lucide) window.lucide.createIcons();
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem('reaction_sound_enabled', soundEnabled.toString());
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  updateSoundIcon();
  if (soundEnabled) {
    sounds.playTone(600, 'sine', 0.1, 0.15);
  }
}

// ==========================================
// 5. 모드 및 카테고리 관리 (개별 / 랜덤 / 지정)
// ==========================================
function setPlayCategory(category) {
  clearAllTimers();
  currentCategory = category;
  try {
    localStorage.setItem('reaction_category', currentCategory);
  } catch (e) {}

  if (category === 'single') {
    currentMode = lastSingleMode || 'green-light';
  } else if (category === 'random') {
    currentMode = 'random';
  } else if (category === 'custom-sequence') {
    currentMode = 'custom-sequence';
    ensureCustomSequenceLength(currentSettings.totalRounds);
  }

  try {
    localStorage.setItem('reaction_current_mode', currentMode);
  } catch (e) {}

  updateCategoryTabsUI();
  updateModeTabsUI();
  updatePBDisplay();
  applySettingsToUI();
  resetToHome(false);
}

function updateCategoryTabsUI() {
  document.querySelectorAll('.category-tab-btn').forEach(btn => {
    const cat = btn.dataset.category;
    if (cat === currentCategory) {
      if (cat === 'single') {
        btn.className = `category-tab-btn active flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-emerald-400 bg-emerald-500/15 font-bold border border-emerald-500/40 shadow-sm`;
      } else if (cat === 'random') {
        btn.className = `category-tab-btn active flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-rose-400 bg-rose-500/15 font-bold border border-rose-500/40 shadow-sm`;
      } else if (cat === 'custom-sequence') {
        btn.className = `category-tab-btn active flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-violet-400 bg-violet-500/15 font-bold border border-violet-500/40 shadow-sm`;
      }
    } else {
      btn.className = `category-tab-btn flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/50`;
    }
  });

  if (currentCategory === 'single') {
    modeSelector.classList.remove('hidden');
  } else {
    modeSelector.classList.add('hidden');
  }
}

function setTestMode(modeId) {
  if (!TEST_MODES[modeId]) return;
  if (currentMode === modeId && currentState === STATES.IDLE) return;

  clearAllTimers();
  currentCategory = 'single';
  currentMode = modeId;
  lastSingleMode = modeId;
  try {
    localStorage.setItem('reaction_category', currentCategory);
    localStorage.setItem('reaction_current_mode', currentMode);
  } catch (e) {}

  updateCategoryTabsUI();
  updateModeTabsUI();
  updatePBDisplay();
  resetToHome(false);
}

function updateModeTabsUI() {
  const modeInfo = TEST_MODES[currentMode] || TEST_MODES['green-light'];
  if (!modeInfo) return;

  document.querySelectorAll('.mode-tab-btn').forEach(btn => {
    const m = btn.dataset.mode;
    if (m === currentMode) {
      btn.className = `mode-tab-btn active shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all text-white bg-slate-800 border border-slate-600 shadow-md scale-100`;
      btn.style.borderColor = modeInfo.accentColor;
    } else {
      btn.className = `mode-tab-btn shrink-0 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all text-slate-400 hover:text-slate-200 border border-transparent`;
      btn.style.borderColor = 'transparent';
    }
  });

  guideModeBadge.textContent = modeInfo.name;
  guideModeBadge.className = `px-2 py-0.5 rounded-md font-bold text-[10px] ${modeInfo.badgeClass}`;
  guideModeDesc.textContent = modeInfo.desc;
  guideModeControls.innerHTML = `<span class="text-slate-400">${modeInfo.controls}</span>`;

  if (window.lucide) window.lucide.createIcons();
}

// ==========================================
// 6. 설정 UI 동기화
// ==========================================
function applySettingsToUI() {
  headerRoundBadge.textContent = `${currentSettings.totalRounds}회`;
  

  roundOptionBtns.forEach(btn => {
    const r = parseInt(btn.dataset.rounds, 10);
    if (r === currentSettings.totalRounds) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  minWaitInput.value = currentSettings.minWaitSec;
  maxWaitInput.value = currentSettings.maxWaitSec;
  minWaitVal.textContent = currentSettings.minWaitSec.toFixed(1);
  maxWaitVal.textContent = currentSettings.maxWaitSec.toFixed(1);
  waitRangeLabel.textContent = `${currentSettings.minWaitSec.toFixed(1)}초 ~ ${currentSettings.maxWaitSec.toFixed(1)}초`;


  if (currentState === STATES.IDLE) {
    renderState(STATES.IDLE);
  }
}


// ==========================================
// showToast: 화면 하단에 일시적으로 알림 메시지를 표시
// ==========================================
function showToast(message, type = 'success') {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  const iconEl = toast.querySelector('#toastIcon');
  const msgEl = toast.querySelector('#toastMessage');
  if (msgEl) msgEl.textContent = message;
  // 타입별 색상 설정
  toast.className = toast.className.replace(/bg-\S+/g, '').replace(/text-\S+/g, '').trim();
  if (type === 'success') {
    toast.classList.add('bg-emerald-500', 'text-slate-950');
    if (iconEl) iconEl.setAttribute('data-lucide', 'check-circle');
  } else if (type === 'error') {
    toast.classList.add('bg-red-500', 'text-white');
    if (iconEl) iconEl.setAttribute('data-lucide', 'x-circle');
  } else {
    toast.classList.add('bg-indigo-500', 'text-white');
    if (iconEl) iconEl.setAttribute('data-lucide', 'info');
  }
  if (window.lucide) window.lucide.createIcons({ nodes: [iconEl] });
  // 표시 애니메이션
  toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
  }, 2500);
}

function saveSettings() {
  try {
    localStorage.setItem('reaction_settings', JSON.stringify(currentSettings));
  } catch (e) {
    console.warn('LocalStorage save error (settings):', e);
  }
  applySettingsToUI();
}

// ==========================================
// 7. 상태 머신 및 UI 렌더링
// ==========================================
function setTestAreaState(stateClass) {
  testArea.classList.remove(
    'state-idle',
    'state-waiting',
    'state-ready',
    'state-early',
    'state-round-result',
    'state-paused',
    'state-decoy',
    'state-missed',
    'state-blackout'
  );
  testArea.classList.add(stateClass);
}

function updateProgress() {
  if (currentState === STATES.IDLE || currentState === STATES.SUMMARY) {
    roundProgressWrapper.classList.add('hidden');
    modeSelector.classList.remove('opacity-40', 'pointer-events-none');
    playCategoryTabs.classList.remove('opacity-40', 'pointer-events-none');
    updateModeTabsUI();
  } else {
    roundProgressWrapper.classList.remove('hidden');
    modeSelector.classList.add('opacity-40', 'pointer-events-none');
    playCategoryTabs.classList.add('opacity-40', 'pointer-events-none');

    const activeInfo = TEST_MODES[activeRoundMode] || TEST_MODES[currentMode] || TEST_MODES['green-light'];
    let modePrefix = '';
    if (currentMode === 'random') {
      modePrefix = `🎲 랜덤 • [${activeInfo.name}]`;
    } else if (currentMode === 'custom-sequence') {
      modePrefix = `📋 지정 • [${activeInfo.name}]`;
    } else {
      modePrefix = activeInfo.name;
    }

    if (currentState === STATES.ROUND_RESULT) {
      roundIndicator.textContent = `라운드 ${currentRound} / ${currentSettings.totalRounds} 완료`;
      const percent = (currentRound / currentSettings.totalRounds) * 100;
      progressBar.style.width = `${percent}%`;
      statusText.textContent = `${modePrefix} 결과 확인 중`;
    } else if (currentState === STATES.PAUSED) {
      roundIndicator.textContent = `라운드 ${currentRound} / ${currentSettings.totalRounds}`;
      const percent = ((currentRound - 1) / currentSettings.totalRounds) * 100;
      progressBar.style.width = `${percent}%`;
      statusText.textContent = '일시정지 중 ⏸️';
    } else {
      roundIndicator.textContent = `라운드 ${currentRound} / ${currentSettings.totalRounds}`;
      const percent = ((currentRound - 1) / currentSettings.totalRounds) * 100;
      progressBar.style.width = `${percent}%`;
      statusText.textContent = `${modePrefix} 진행 중`;
    }

    // 테스트 진행 중 가이드 배너도 현재 액티브 라운드 모드로 안내
    guideModeBadge.textContent = activeInfo.name;
    guideModeBadge.className = `px-2 py-0.5 rounded-md font-bold text-[10px] ${activeInfo.badgeClass}`;
    guideModeDesc.textContent = activeInfo.desc;
    guideModeControls.innerHTML = `<span class="text-slate-400">${activeInfo.controls}</span>`;
  }
}

function renderState(state, extraData = {}) {
  currentState = state;
  updateProgress();

  if (state === STATES.SUMMARY) {
    testArea.classList.add('hidden');
    roundProgressWrapper.classList.add('hidden');
    resultDashboard.classList.remove('hidden');
    renderSummaryDashboard();
    return;
  } else {
    testArea.classList.remove('hidden');
    resultDashboard.classList.add('hidden');
  }

  const modeInfo = TEST_MODES[currentMode] || TEST_MODES['green-light'];

  switch (state) {
    // ------------------------------------------
    // [IDLE] 각 모드별 시작 전 홈 화면 (미리보기 & 사전 안내)
    // ------------------------------------------
    case STATES.IDLE:
      setTestAreaState('state-idle');

      if (currentCategory === 'random' || currentMode === 'random') {
        // [랜덤 모드 홈 화면]
        testContent.innerHTML = `
          <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-rose-500/30 flex items-center justify-center mb-3 shadow-lg shadow-black/40 text-rose-400">
            <i data-lucide="shuffle" class="w-8 h-8 stroke-[2.2]"></i>
          </div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-xs px-2.5 py-0.5 rounded-md font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">무작위 ${currentSettings.totalRounds}회</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">랜덤 모드 테스트</h2>
          </div>
          <p class="text-slate-300 text-xs sm:text-sm max-w-sm mb-3 leading-relaxed">
            매 회차 12가지 반응 테스트 중 하나가 무작위로 추첨되어 총 ${currentSettings.totalRounds}회차 배정됩니다.
          </p>

          <!-- 12종 테스트 풀 배지 프리뷰 -->
          <div class="mb-3.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 w-full max-w-md mx-auto">
            <span class="text-[11px] text-slate-400 font-bold block mb-2">🎲 12종 테스트 추첨 풀 (중복 허용)</span>
            <div class="grid grid-cols-4 sm:grid-cols-6 gap-1.5 text-center">
              <div class="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <span class="text-base block">⚡</span>
                <span class="text-[9px] font-bold block mt-0.5">초록불</span>
              </div>
              <div class="p-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300">
                <span class="text-base block">🎨</span>
                <span class="text-[9px] font-bold block mt-0.5">색상</span>
              </div>
              <div class="p-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300">
                <span class="text-base block">🧭</span>
                <span class="text-[9px] font-bold block mt-0.5">방향</span>
              </div>
              <div class="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <span class="text-base block">🎯</span>
                <span class="text-[9px] font-bold block mt-0.5">위치</span>
              </div>
              <div class="p-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <span class="text-base block">🔷</span>
                <span class="text-[9px] font-bold block mt-0.5">도형</span>
              </div>
              <div class="p-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                <span class="text-base block">🎧</span>
                <span class="text-[9px] font-bold block mt-0.5">소리</span>
              </div>
              <div class="p-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                <span class="text-base block">🤜</span>
                <span class="text-[9px] font-bold block mt-0.5">홀드</span>
              </div>
              <div class="p-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300">
                <span class="text-base block">⚡⚡</span>
                <span class="text-[9px] font-bold block mt-0.5">동시자극</span>
              </div>
              <div class="p-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <span class="text-base block">🔄</span>
                <span class="text-[9px] font-bold block mt-0.5">순서반전</span>
              </div>
              <div class="p-1.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-300">
                <span class="text-base block">🌑</span>
                <span class="text-[9px] font-bold block mt-0.5">신호종료</span>
              </div>
              <div class="p-1.5 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-300">
                <span class="text-base block">🎯</span>
                <span class="text-[9px] font-bold block mt-0.5">압력타이밍</span>
              </div>
              <div class="p-1.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300">
                <span class="text-base block">🔢</span>
                <span class="text-[9px] font-bold block mt-0.5">숫자출현</span>
              </div>
            </div>
          </div>

          <!-- 소리 테스트 대비 사전 청취 가이드 -->
          <div class="mb-4 p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-center w-full max-w-sm mx-auto">
            <p class="text-[11px] text-slate-400 mb-2">🎧 무작위 추첨 중 소리 테스트가 나올 수 있습니다. 목표 소리를 미리 확인해보세요.</p>
            <button id="sampleAudioBtn" type="button" class="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-95 mx-auto">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              <span>목표 소리 들어보기 (사전 청취)</span>
            </button>
          </div>

          <!-- 설정 요약 (읽기 전용) -->
          <div class="flex items-center justify-center flex-wrap gap-2 mb-4">
            <span class="text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 font-medium flex items-center gap-1.5">
              <i data-lucide="repeat" class="w-3.5 h-3.5 text-rose-400"></i>
              설정된 반복 횟수: <span class="font-bold text-white font-mono">${currentSettings.totalRounds}회</span>
            </span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-amber-300 font-medium flex items-center gap-1">
              <i data-lucide="clock" class="w-3 h-3"></i>
              대기: ${currentSettings.minWaitSec}s ~ ${currentSettings.maxWaitSec}s
            </span>
            <button id="quickSettingsBtn" class="text-xs px-2.5 py-1 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 flex items-center gap-1 transition-colors">
              <i data-lucide="settings" class="w-3 h-3"></i>
              설정 변경
            </button>
          </div>

          <button id="startTestBtn" class="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/25 transition-all transform hover:scale-105 active:scale-95 text-base flex items-center gap-2 cursor-pointer mb-2">
            <i data-lucide="shuffle" class="w-5 h-5"></i>
            <span>랜덤 테스트 시작 (${currentSettings.totalRounds}회 무작위)</span>
            <i data-lucide="arrow-right" class="w-4 h-4 stroke-[2.5]"></i>
          </button>
        `;
      } else if (currentCategory === 'custom-sequence' || currentMode === 'custom-sequence') {
        // [지정 모드 홈 화면] - 12종 전체 모드 선택지
        ensureCustomSequenceLength(currentSettings.totalRounds);

        const seqOptions = [
          { id: 'green-light', name: '⚡ 초록불 반응' },
          { id: 'color-match', name: '🎨 색상 구분' },
          { id: 'direction', name: '🧭 방향 반응' },
          { id: 'position', name: '🎯 위치 조준' },
          { id: 'shape', name: '🔷 도형 반응' },
          { id: 'audio', name: '🎧 소리 반응' },
          { id: 'hold-release', name: '🤜 홀드 반응' },
          { id: 'dual-stimuli', name: '⚡⚡ 동시 자극' },
          { id: 'inverted-direction', name: '🔄 순서 반전' },
          { id: 'signal-offset', name: '🌑 신호 종료' },
          { id: 'expansion-timing', name: '🎯 압력 타이밍' },
          { id: 'rapid-number', name: '🔢 숫자 출현' }
        ];

        const seqRowsHtml = Array.from({ length: currentSettings.totalRounds }, (_, idx) => {
          const roundNum = idx + 1;
          const currentVal = customSequence[idx] || MULTI_MODE_POOL[idx % MULTI_MODE_POOL.length];
          const optionsHtml = seqOptions.map(opt => `
            <option value="${opt.id}" ${opt.id === currentVal ? 'selected' : ''} class="bg-slate-900 text-white">
              ${opt.name}
            </option>
          `).join('');

          const isOddCount = (currentSettings.totalRounds % 2 === 1);
          const isLastItem = isOddCount && (idx === currentSettings.totalRounds - 1);
          return `
            <div class="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/40 transition-colors shadow-sm ${isLastItem ? 'sm:col-span-2 sm:max-w-xs sm:mx-auto sm:w-full' : ''}">
              <span class="w-14 px-2 py-1 text-center text-xs font-bold text-violet-300 bg-violet-500/15 border border-violet-500/30 rounded-lg flex-shrink-0">
                ${roundNum}회차
              </span>
              <select class="seq-select flex-1 bg-slate-950 border border-slate-700/80 hover:border-violet-400 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:ring-1 focus:ring-violet-400 cursor-pointer min-w-0 transition-colors" data-seq-index="${idx}">
                ${optionsHtml}
              </select>
            </div>
          `;
        }).join('');

        const flowChipsHtml = customSequence.slice(0, currentSettings.totalRounds).map((mId, i) => {
          const mInfo = TEST_MODES[mId] || TEST_MODES['green-light'];
          const isLast = (i === currentSettings.totalRounds - 1);
          return `
            <div class="flex items-center gap-1 sm:gap-1.5 my-0.5">
              <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${mInfo.badgeClass} shadow-sm whitespace-nowrap">
                <span class="opacity-75">${i + 1}R</span>
                <span>${mInfo.name}</span>
              </span>
              ${!isLast ? `<i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-600 flex-shrink-0"></i>` : ''}
            </div>
          `;
        }).join('');

        testContent.innerHTML = `
          <div class="w-14 h-14 rounded-2xl bg-slate-900 border border-violet-500/30 flex items-center justify-center mb-2 shadow-lg shadow-black/40 text-violet-400">
            <i data-lucide="list-ordered" class="w-7 h-7 stroke-[2.2]"></i>
          </div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs px-2.5 py-0.5 rounded-md font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">사용자 지정 ${currentSettings.totalRounds}회</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">지정 모드 구성</h2>
          </div>
          <p class="text-slate-300 text-xs max-w-sm mb-3">
            1회차부터 ${currentSettings.totalRounds}회차까지 직접 지정한 테스트 순서(12종)대로 진행됩니다.
          </p>

          <!-- 설정 요약 (읽기 전용) -->
          <div class="flex items-center justify-center flex-wrap gap-2 mb-3.5">
            <span class="text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 font-medium flex items-center gap-1.5">
              <i data-lucide="repeat" class="w-3.5 h-3.5 text-violet-400"></i>
              설정된 반복 횟수: <span class="font-bold text-white font-mono">${currentSettings.totalRounds}회</span>
            </span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-amber-300 font-medium flex items-center gap-1">
              <i data-lucide="clock" class="w-3 h-3"></i>
              대기: ${currentSettings.minWaitSec}s ~ ${currentSettings.maxWaitSec}s
            </span>
            <button id="quickSettingsBtn" class="text-xs px-2.5 py-1 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 flex items-center gap-1 transition-colors">
              <i data-lucide="settings" class="w-3 h-3"></i>
              설정 변경
            </button>
          </div>

          <!-- 빠른 프리셋 버튼 모음 -->
          <div class="mb-3.5 flex items-center justify-center gap-1.5 flex-wrap max-w-lg mx-auto">
            <span class="text-[11px] text-slate-400 font-semibold mr-1">빠른 프리셋:</span>
            <button type="button" class="preset-btn px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-[11px] font-semibold transition-all" data-preset="balanced">
              ✨ 기본 6종
            </button>
            <button type="button" class="preset-btn px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-[11px] font-semibold transition-all" data-preset="new6">
              🆕 신규 6종
            </button>
            <button type="button" class="preset-btn px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-[11px] font-semibold transition-all" data-preset="visual">
              👁️ 시각 집중
            </button>
            <button type="button" class="preset-btn px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-[11px] font-semibold transition-all" data-preset="sound-mix">
              🎧 소리 믹스
            </button>
            <button type="button" class="preset-btn px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-[11px] font-semibold transition-all" data-preset="random-fill">
              🎲 무작위 채우기
            </button>
          </div>

          <!-- 1~N회차 지정 드롭다운 카드 (반응형 2열 + 내부 스크롤) -->
          <div class="w-full max-w-xl mx-auto mb-3.5">
            <div class="flex items-center justify-between px-1 mb-2">
              <span class="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <i data-lucide="layers" class="w-3.5 h-3.5 text-violet-400"></i>
                회차별 테스트 선택 (1~${currentSettings.totalRounds}회차)
              </span>
              <span class="text-[10px] text-slate-400 font-mono">총 ${currentSettings.totalRounds}회 구성</span>
            </div>
            <div class="max-h-60 sm:max-h-72 overflow-y-auto pr-1.5 p-2 rounded-2xl bg-slate-950/50 border border-slate-800/80 shadow-inner">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${seqRowsHtml}
              </div>
            </div>
          </div>

          <!-- 실시간 순서 플로우 타임라인 -->
          <div class="mb-3.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 w-full max-w-xl mx-auto">
            <div class="flex items-center justify-between mb-2 px-1">
              <span class="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                <i data-lucide="route" class="w-3.5 h-3.5 text-violet-400"></i>
                진행 순서 타임라인
              </span>
              <span class="text-[10px] text-slate-500 font-mono">총 ${currentSettings.totalRounds}회차</span>
            </div>
            <div class="max-h-24 sm:max-h-28 overflow-y-auto p-1 pr-1.5">
              <div class="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap">
                ${flowChipsHtml}
              </div>
            </div>
          </div>

          <!-- 하단 버튼 및 사전 청취 정돈 -->
          <div class="flex flex-col items-center gap-2.5 w-full max-w-sm mx-auto mb-2">
            <button id="sampleAudioBtn" type="button" class="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
              <span>목표 소리 들어보기 (사전 청취)</span>
            </button>

            <button id="startTestBtn" class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white font-bold rounded-2xl shadow-xl shadow-violet-600/25 transition-all transform hover:scale-105 active:scale-95 text-base flex items-center justify-center gap-2 cursor-pointer">
              <i data-lucide="list-ordered" class="w-5 h-5"></i>
              <span>지정 순서로 테스트 시작 (${currentSettings.totalRounds}회)</span>
              <i data-lucide="arrow-right" class="w-4 h-4 stroke-[2.5]"></i>
            </button>
          </div>
        `;
      } else {
        // [개별 테스트 홈 화면]
        let extraModeHtml = '';
        if (currentMode === 'audio') {
          extraModeHtml = `
            <div class="mb-5 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center w-full max-w-sm mx-auto">
              <span class="text-xs text-indigo-300 font-bold block mb-1">🎧 청각 자극 사전 인지 가이드</span>
              <p class="text-[11px] text-slate-400 mb-3">테스트 시 화면 변화 없이 소리만 출력됩니다. 볼륨을 확인하고 목표 소리를 미리 들어보세요.</p>
              <button id="sampleAudioBtn" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 mx-auto">
                <i data-lucide="volume-2" class="w-4 h-4"></i>
                <span>목표 소리 들어보기 (사전 청취)</span>
              </button>
              <span class="text-[10px] text-indigo-400/80 block mt-1.5">* 이 재생은 반응속도 측정에 포함되지 않습니다</span>
            </div>
          `;
        }

        testContent.innerHTML = `
          <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-4 shadow-lg shadow-black/40 text-white" style="color: ${modeInfo.accentColor}">
            <i data-lucide="${modeInfo.icon}" class="w-8 h-8 stroke-[2.2]"></i>
          </div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-xs px-2.5 py-0.5 rounded-md font-bold ${modeInfo.badgeClass}">${modeInfo.badge}</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">${modeInfo.name} 테스트</h2>
          </div>
          <p class="text-slate-300 text-xs sm:text-sm max-w-sm mb-4 leading-relaxed">
            ${modeInfo.desc}
          </p>

          ${extraModeHtml}

          <!-- 설정 요약 (읽기 전용) -->
          <div class="flex items-center justify-center flex-wrap gap-2 mb-6">
            <span class="text-xs px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-slate-300 font-medium flex items-center gap-1.5">
              <i data-lucide="repeat" class="w-3.5 h-3.5 text-emerald-400"></i>
              설정된 반복 횟수: <span class="font-bold text-white font-mono">${currentSettings.totalRounds}회</span>
            </span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-amber-300 font-medium flex items-center gap-1">
              <i data-lucide="clock" class="w-3 h-3"></i>
              대기: ${currentSettings.minWaitSec}s ~ ${currentSettings.maxWaitSec}s
            </span>
            <button id="quickSettingsBtn" class="text-xs px-2.5 py-1 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 flex items-center gap-1 transition-colors">
              <i data-lucide="settings" class="w-3 h-3"></i>
              설정 변경
            </button>
          </div>

          <button id="startTestBtn" class="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-105 active:scale-95 text-base flex items-center gap-2 cursor-pointer">
            <span>테스트 시작 (${currentSettings.totalRounds}회)</span>
            <i data-lucide="arrow-right" class="w-4 h-4 stroke-[2.5]"></i>
          </button>
        `;
      }
      break;

        // ------------------------------------------
    // [WAITING] 모드별 준비 및 무작위 대기 단계
    // ------------------------------------------
    case STATES.WAITING:
      renderWaitingPhase();
      break;

    // ------------------------------------------
    // [DECOY] 가짜 착시 플래시 (어려움 모드)
    // ------------------------------------------
    case STATES.DECOY:
      setTestAreaState('state-decoy');
      testContent.innerHTML = `
        <div class="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4">
          <i data-lucide="eye" class="w-8 h-8 text-amber-950"></i>
        </div>
        <h2 class="text-2xl sm:text-4xl font-black text-amber-950 mb-2 tracking-tight">속지 마세요! ⚠️</h2>
        <p class="text-amber-950/90 font-bold text-sm sm:text-base">목표 신호가 아닙니다! (가짜 플래시)</p>
      `;
      break;

    // ------------------------------------------
    // [READY_TO_CLICK] 목표 자극 제시 및 측정 단계
    // ------------------------------------------
    case STATES.READY_TO_CLICK:
      renderReadyPhase();
      break;

    // ------------------------------------------
    // [EARLY_CLICK] 조기 클릭/입력 경고
    // ------------------------------------------
    case STATES.EARLY_CLICK: {
      setTestAreaState('state-early');
      const isDecoyFool = extraData.isDecoy;

      testContent.innerHTML = `
        <div class="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4">
          <i data-lucide="alert-triangle" class="w-9 h-9 text-amber-100"></i>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
          ${isDecoyFool ? '가짜 신호에 속았습니다! ⚠️' : '너무 빨랐습니다! ⚠️ (조기 반응)'}
        </h2>
        <p class="text-amber-100/90 text-sm sm:text-base mb-6 max-w-xs">
          ${isDecoyFool ? '목표 신호가 아닌 가짜 플래시에 반응했습니다.' : '목표 자극이 제시되기 전에 미리 반응했습니다.'}<br/>
          (조기 반응은 정확도 통계에 반영되며, 해당 라운드를 재시도합니다)
        </p>
        <div class="flex flex-col items-center gap-2">
          <button id="retryRoundBtn" type="button" class="relative z-20 px-7 py-3 bg-white hover:bg-amber-50 text-amber-950 font-bold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer pointer-events-auto">
            <i data-lucide="rotate-ccw" class="w-4 h-4 text-amber-950"></i>
            <span>클릭 또는 스페이스바로 재도전</span>
          </button>
          <span class="text-[11px] text-amber-100/80 mt-1 block pointer-events-none">
            💡 화면을 클릭하거나 버튼, 또는 Spacebar를 눌러 재도전하세요.
          </span>
        </div>
      `;
      break;
    }

    // ------------------------------------------
    // [MISSED] 오답 또는 시간 초과
    // ------------------------------------------
    case STATES.MISSED: {
      setTestAreaState('state-missed');
      const isWrongAnswer = extraData.isWrong;
      const isEarlyClick = extraData.isEarly;
      const isTimeoutMiss = extraData.isTimeout;
      let missedTitle = '시간 초과! (Missed)';
      let missedDesc = '제한시간 내에 반응하지 못했습니다.';
      let missedIcon = 'clock-alert';

      if (isEarlyClick) {
        missedIcon = 'alert-triangle';
        missedTitle = '너무 빠릅니다! (조기 반응)';
        missedDesc = extraData.timingDiff ? `목표 접촉점보다 ${Math.abs(extraData.timingDiff)}ms 일찍 눌렀습니다.` : '신호가 오기 전에 너무 일찍 눌렀습니다.';
      } else if (isWrongAnswer) {
        missedIcon = 'x-circle';
        missedTitle = '틀렸습니다! (오답)';
        missedDesc = '제시된 목표와 일치하지 않는 입력을 하였습니다.';
      } else if (isTimeoutMiss && extraData.timingDiff) {
        missedIcon = 'clock-alert';
        missedTitle = '지연 반응! (Late)';
        missedDesc = `목표 접촉점보다 ${extraData.timingDiff}ms 늦게 눌렀습니다.`;
      }

      testContent.innerHTML = `
        <div class="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4">
          <i data-lucide="${missedIcon}" class="w-9 h-9 text-rose-100"></i>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
          ${missedTitle}
        </h2>
        <p class="text-rose-100/90 text-sm sm:text-base mb-6 max-w-xs">
          ${missedDesc}
        </p>
        <div class="px-6 py-2.5 bg-white text-rose-950 font-bold rounded-xl shadow-lg hover:bg-rose-50 active:scale-95 transition-all text-sm flex items-center gap-2 pointer-events-none">
          <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
          <span>클릭 또는 스페이스바로 계속 진행</span>
        </div>
      `;
      break;
    }

    // ------------------------------------------
    // [ROUND_RESULT] 회차별 전환 화면 (Intermission / Next Step Screen)
    // ------------------------------------------
    case STATES.ROUND_RESULT:
      setTestAreaState('state-round-result');
      lastRoundResultData = extraData;
      const latestMs = extraData.reactionTime || 0;
      const resultStatus = extraData.resultStatus || 'correct';
      const roundIdx = extraData.roundIndex || currentRound;
      const isLast = roundIdx >= currentSettings.totalRounds;
      const completedMode = extraData.roundMode || activeRoundMode || currentMode;
      const completedModeInfo = TEST_MODES[completedMode] || TEST_MODES['green-light'];

      // 판정 배지 UI (정답 / 오답 / 조기클릭 / 시간초과)
      let statusBadgeHtml = '';
      if (resultStatus === 'correct') {
        statusBadgeHtml = `
          <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 font-bold text-xs shadow-md shadow-emerald-950/40 mb-3 animate-scale-up">
            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-300"></i>
            <span>정답! (Correct)</span>
          </div>
        `;
      } else if (resultStatus === 'wrong') {
        statusBadgeHtml = `
          <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/30 border border-rose-400/50 text-rose-200 font-bold text-xs shadow-md shadow-rose-950/40 mb-3 animate-scale-up">
            <i data-lucide="x-circle" class="w-4 h-4 text-rose-300"></i>
            <span>${extraData.isTimeout ? '시간 초과 (Missed)' : '오답 (Incorrect)'}</span>
          </div>
        `;
      } else {
        statusBadgeHtml = `
          <div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/30 border border-amber-400/50 text-amber-200 font-bold text-xs shadow-md shadow-amber-950/40 mb-3 animate-scale-up">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-300"></i>
            <span>조기 반응 (False Start)</span>
          </div>
        `;
      }

      // [다음으로] 버튼 UI: 마지막 회차일 때는 [최종 결과 확인하기]
      let nextBtnHtml = '';
      if (isLast) {
        nextBtnHtml = `
          <button id="nextStepBtn" type="button" class="px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black rounded-2xl shadow-xl shadow-black/30 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer">
            <i data-lucide="award" class="w-5 h-5 text-slate-950 stroke-[2.5]"></i>
            <span>최종 결과 확인하기</span>
            <i data-lucide="arrow-right" class="w-5 h-5 text-slate-950 stroke-[2.5]"></i>
          </button>
        `;
      } else if (currentMode === 'custom-sequence') {
        const nextModeKey = customSequence[roundIdx] || 'color-match';
        const nextModeInfo = TEST_MODES[nextModeKey] || TEST_MODES['color-match'];
        nextBtnHtml = `
          <button id="nextStepBtn" type="button" class="px-8 py-3.5 bg-white hover:bg-violet-50 text-violet-950 font-extrabold rounded-2xl shadow-xl shadow-black/25 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer">
            <span>다음 문제로: [${nextModeInfo.name}] (라운드 ${roundIdx + 1}/${currentSettings.totalRounds})</span>
            <i data-lucide="arrow-right" class="w-5 h-5 text-violet-900 stroke-[2.5]"></i>
          </button>
        `;
      } else if (currentMode === 'random') {
        const nextModeKey = randomSequence[roundIdx] || MULTI_MODE_POOL[0];
        const nextModeInfo = TEST_MODES[nextModeKey] || TEST_MODES['color-match'];
        nextBtnHtml = `
          <button id="nextStepBtn" type="button" class="px-8 py-3.5 bg-white hover:bg-rose-50 text-rose-950 font-extrabold rounded-2xl shadow-xl shadow-black/25 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer">
            <span>다음 문제로: [${nextModeInfo.name}] (무작위 🎲 • 라운드 ${roundIdx + 1}/${currentSettings.totalRounds})</span>
            <i data-lucide="arrow-right" class="w-5 h-5 text-rose-900 stroke-[2.5]"></i>
          </button>
        `;
      } else {
        nextBtnHtml = `
          <button id="nextStepBtn" type="button" class="px-8 py-3.5 bg-white hover:bg-blue-50 text-blue-900 font-extrabold rounded-2xl shadow-xl shadow-black/25 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base flex items-center justify-center gap-2.5 cursor-pointer">
            <span>다음 문제로 (라운드 ${roundIdx + 1}/${currentSettings.totalRounds})</span>
            <i data-lucide="arrow-right" class="w-5 h-5 text-blue-900 stroke-[2.5]"></i>
          </button>
        `;
      }

      let roundHeaderTitle = '';
      if (currentMode === 'random') {
        roundHeaderTitle = `🎲 랜덤 모드 • [${completedModeInfo.name}] 라운드 ${roundIdx} / ${currentSettings.totalRounds} 완료`;
      } else if (currentMode === 'custom-sequence') {
        roundHeaderTitle = `📋 지정 모드 • [${completedModeInfo.name}] 라운드 ${roundIdx} / ${currentSettings.totalRounds} 완료`;
      } else {
        roundHeaderTitle = `${completedModeInfo.name} • 라운드 ${roundIdx} / ${currentSettings.totalRounds} 완료`;
      }

      // 홀드/압력 타이밍 추가 정보 HTML
      let extraInfoHtml = '';
      if (completedMode === 'hold-release' && extraData.holdPressTime && extraData.holdReleaseTime) {
        extraInfoHtml = `
          <div class="flex items-center justify-center gap-3 mb-3 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs font-bold">
              <i data-lucide="hand" class="w-3.5 h-3.5"></i>
              누르기: ${extraData.holdPressTime}ms
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-200 text-xs font-bold">
              <i data-lucide="arrow-up-circle" class="w-3.5 h-3.5"></i>
              떼기: ${extraData.holdReleaseTime}ms
            </span>
          </div>
        `;
      } else if (completedMode === 'expansion-timing' && extraData.timingDiff !== undefined) {
        const diffAbs = Math.abs(extraData.timingDiff);
        const diffDir = extraData.timingDiff > 0 ? '늦음 (Late)' : extraData.timingDiff < 0 ? '빠름 (Early)' : '완벽 (Perfect!)';
        const diffColor = diffAbs < 50 ? 'text-emerald-200 border-emerald-500/30 bg-emerald-500/20' : diffAbs < 120 ? 'text-amber-200 border-amber-500/30 bg-amber-500/20' : 'text-rose-200 border-rose-500/30 bg-rose-500/20';
        extraInfoHtml = `
          <div class="flex items-center justify-center mb-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl ${diffColor} border text-xs font-bold">
              <i data-lucide="target" class="w-3.5 h-3.5"></i>
              타이밍 오차: ±${diffAbs}ms (${diffDir})
            </span>
          </div>
        `;
      }

      testContent.innerHTML = `
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold mb-2 border border-white/15 backdrop-blur-sm">
          <i data-lucide="${completedModeInfo.icon}" class="w-3.5 h-3.5 text-blue-200"></i>
          <span>${roundHeaderTitle}</span>
        </div>

        ${statusBadgeHtml}

        <div class="flex items-baseline justify-center gap-2 mb-2">
          <span class="text-6xl sm:text-7xl font-black text-white font-mono tracking-tight drop-shadow-md">${latestMs}</span>
          <span class="text-2xl sm:text-3xl font-extrabold text-blue-200">ms</span>
        </div>

        ${extraInfoHtml}

        <p class="text-blue-100 text-xs sm:text-sm mb-6 max-w-sm leading-relaxed">
          ${getFeedbackShort(latestMs)}
        </p>

        <div class="flex flex-col items-center gap-2">
          ${nextBtnHtml}
          <span class="text-[11px] text-blue-200/90 mt-1 block">
            💡 화면을 클릭하거나 [다음으로] 버튼, 또는 Spacebar를 눌러 진행하세요.
          </span>
        </div>
      `;
      break;

    // ------------------------------------------
    // [PAUSED] 일시정지 상태
    // ------------------------------------------
    case STATES.PAUSED:
      setTestAreaState('state-paused');
      testContent.innerHTML = `
        <div class="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4 animate-pulse shadow-lg">
          <i data-lucide="pause" class="w-8 h-8 text-indigo-100"></i>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">테스트 일시정지 중 ⏸️</h2>
        <p class="text-indigo-100/90 text-xs sm:text-sm mb-6 max-w-sm leading-relaxed">
          ${modeInfo.name} 측정이 중단되었습니다. [계속 진행]으로 라운드 ${currentRound}를 이어가거나, [홈으로]를 눌러 첫 화면으로 초기화할 수 있습니다.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none">
          <button id="resumeBtn" class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer">
            <i data-lucide="play" class="w-4 h-4 fill-slate-950 stroke-none"></i>
            <span>계속 진행 (Resume)</span>
          </button>
          <button id="goHomeBtn" class="w-full sm:w-auto px-5 py-2.5 bg-slate-900/90 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 font-semibold rounded-xl border border-slate-700 hover:border-rose-500/30 text-sm transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
            <i data-lucide="home" class="w-4 h-4"></i>
            <span>홈으로 / 처음으로</span>
          </button>
        </div>
      `;
      break;
  }

  if (window.lucide) window.lucide.createIcons();

  // 인라인 버튼 이벤트 바인딩
  if (state === STATES.IDLE) {
    const quickSettingsBtn = document.getElementById('quickSettingsBtn');
    if (quickSettingsBtn) {
      quickSettingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSettingsModal();
      });
    }

    // 지정 모드 드롭다운 변경 리스너
    document.querySelectorAll('.seq-select').forEach(select => {
      select.addEventListener('change', (e) => {
        e.stopPropagation();
        const idx = parseInt(select.dataset.seqIndex, 10);
        if (!isNaN(idx) && idx >= 0 && idx < currentSettings.totalRounds) {
          customSequence[idx] = select.value;
          try {
            localStorage.setItem('reaction_custom_sequence', JSON.stringify(customSequence));
          } catch (err) {}
          renderState(STATES.IDLE);
        }
      });
      select.addEventListener('pointerdown', (e) => e.stopPropagation());
    });

    // 지정 모드 빠른 프리셋 버튼 리스너
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const preset = btn.dataset.preset;
        const count = currentSettings.totalRounds;
        if (preset === 'balanced') {
          const base = ['green-light', 'color-match', 'direction', 'position', 'shape', 'audio'];
          customSequence = Array.from({ length: count }, (_, i) => base[i % base.length]);
        } else if (preset === 'new6') {
          const base = ['hold-release', 'dual-stimuli', 'inverted-direction', 'signal-offset', 'expansion-timing', 'rapid-number'];
          customSequence = Array.from({ length: count }, (_, i) => base[i % base.length]);
        } else if (preset === 'visual') {
          const base = ['green-light', 'color-match', 'position', 'shape', 'direction', 'signal-offset'];
          customSequence = Array.from({ length: count }, (_, i) => base[i % base.length]);
        } else if (preset === 'sound-mix') {
          const base = ['audio', 'green-light', 'audio', 'color-match', 'audio', 'shape'];
          customSequence = Array.from({ length: count }, (_, i) => base[i % base.length]);
        } else if (preset === 'random-fill') {
          customSequence = Array.from({ length: count }, () => MULTI_MODE_POOL[Math.floor(Math.random() * MULTI_MODE_POOL.length)]);
        }
        try {
          localStorage.setItem('reaction_custom_sequence', JSON.stringify(customSequence));
        } catch (err) {}
        renderState(STATES.IDLE);
      });
      btn.addEventListener('pointerdown', (e) => e.stopPropagation());
    });

    const sampleAudioBtn = document.getElementById('sampleAudioBtn');
    if (sampleAudioBtn) {
      let sampleFeedbackTimer = null;
      const handleSampleAudio = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 버튼 시각 피드백 (재생 중 애니메이션)
        sampleAudioBtn.classList.add('ring-2', 'ring-indigo-300', 'bg-indigo-500', 'scale-95');
        const iconEl = sampleAudioBtn.querySelector('i');
        if (iconEl) iconEl.classList.add('animate-bounce', 'text-amber-300');

        clearTimeout(sampleFeedbackTimer);
        sampleFeedbackTimer = setTimeout(() => {
          sampleAudioBtn.classList.remove('ring-2', 'ring-indigo-300', 'bg-indigo-500', 'scale-95');
          if (iconEl) iconEl.classList.remove('animate-bounce', 'text-amber-300');
        }, 280);

        try {
          await sounds.playTargetSound();
        } catch (err) {
          console.error('사전 청취 오디오 재생 실패:', err);
          alert('오디오를 재생할 수 없습니다. 브라우저의 소리 재생 권한을 허용해 주시거나 음소거 상태를 확인해 주세요.');
        }
      };

      sampleAudioBtn.addEventListener('click', handleSampleAudio);
      sampleAudioBtn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
      });
    }
  } else if (state === STATES.ROUND_RESULT) {
    const nextStepBtn = document.getElementById('nextStepBtn');
    if (nextStepBtn) {
      const handleNextStep = (e) => {
        e.preventDefault();
        e.stopPropagation();
        proceedFromRoundResult();
      };
      nextStepBtn.addEventListener('click', handleNextStep);
      nextStepBtn.addEventListener('pointerdown', handleNextStep);
    }
  } else if (state === STATES.EARLY_CLICK) {
    const retryRoundBtn = document.getElementById('retryRoundBtn');
    if (retryRoundBtn) {
      const handleRetry = (e) => {
        e.preventDefault();
        e.stopPropagation();
        startRound();
      };
      retryRoundBtn.addEventListener('click', handleRetry);
      retryRoundBtn.addEventListener('pointerdown', handleRetry);
    }
  } else if (state === STATES.PAUSED) {
    const resumeBtn = document.getElementById('resumeBtn');
    const goHomeBtn = document.getElementById('goHomeBtn');
    if (resumeBtn) {
      const handleResume = (e) => {
        e.preventDefault();
        e.stopPropagation();
        resumeTest();
      };
      resumeBtn.addEventListener('click', handleResume);
      resumeBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
    }
    if (goHomeBtn) {
      const handleGoHome = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuitConfirmModal();
      };
      goHomeBtn.addEventListener('click', handleGoHome);
      goHomeBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
    }
  }
}

// ==========================================
// 8. 모드별 [대기 단계 (WAITING)] 렌더링
// ==========================================
function renderWaitingPhase() {
  switch (activeRoundMode) {
    // ------------------------------------------
    // 1. 초록불: 빨간 화면 대기
    // ------------------------------------------
    case 'green-light':
      setTestAreaState('state-waiting');
      testContent.innerHTML = `
        <div class="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-5 animate-pulse">
          <i data-lucide="hourglass" class="w-8 h-8 text-white"></i>
        </div>
        <h2 class="text-2xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">초록색을 기다리세요...</h2>
        <p class="text-red-100/80 text-sm sm:text-base font-medium">화면이 초록색으로 바뀌면 즉시 클릭하세요!</p>
        <div class="mt-6 flex items-center gap-2 text-xs text-red-200/70 bg-red-950/40 px-3.5 py-1.5 rounded-full border border-red-500/30">
          <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
          <span>지금 누르면 조기 클릭 실패입니다</span>
        </div>
      `;
      break;

    // ------------------------------------------
    // 2. 색상 구분: 선택지 버튼 미리 노출 + 상단 목표 대기
    // ------------------------------------------
    case 'color-match':
      setTestAreaState('state-idle');
      const shuffledColors = modeQuestionData ? modeQuestionData.shuffledColors : [];
      const previewColorBtns = shuffledColors.map(c => `
        <button type="button" class="preview-color-btn p-4 sm:p-5 rounded-2xl font-black text-white text-base sm:text-lg shadow-md border border-white/20 opacity-80 cursor-pointer transition-all" data-color-id="${c.id}" style="background-color: ${c.hex}">
          <span>${c.name}</span>
        </button>
      `).join('');

      testContent.innerHTML = `
        <div class="mb-4">
          <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">색상 버튼을 확인하세요</span>
          <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base sm:text-lg font-bold bg-slate-900 border border-slate-700 text-slate-300 animate-pulse">
            <i data-lucide="hourglass" class="w-4 h-4 text-pink-400 animate-spin"></i>
            <span>목표 색상 대기 중... (미리 누르면 실패)</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm pointer-events-auto">
          ${previewColorBtns}
        </div>
      `;

      // 대기 중 버튼 클릭 시 조기 클릭 처리
      testContent.querySelectorAll('.preview-color-btn').forEach(btn => {
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleEarlyClick();
        });
      });
      break;

    // ------------------------------------------
    // 3. 방향 반응: 4방향 선택지 가이드 미리 노출 + 중앙 목표 대기
    // ------------------------------------------
    case 'direction':
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <div class="mb-4 text-center">
          <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">방향 선택지 가이드</span>
          <div class="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-slate-900/80 border-2 border-slate-700 text-slate-500 flex items-center justify-center animate-pulse">
            <span class="text-4xl sm:text-5xl font-black text-slate-600">?</span>
          </div>
          <span class="text-xs font-bold text-sky-400/80 mt-2 block animate-pulse">목표 방향 대기 중...</span>
        </div>

        <!-- 4방향 D-패드 가이드 미리 노출 -->
        <div class="grid grid-cols-3 gap-2 w-48 mx-auto mt-2 pointer-events-auto">
          <div></div>
          <button type="button" class="preview-dir-btn p-3 rounded-xl bg-slate-800 text-slate-400 font-bold border border-slate-700 flex items-center justify-center" data-dir="up">
            <i data-lucide="arrow-up" class="w-5 h-5"></i>
          </button>
          <div></div>

          <button type="button" class="preview-dir-btn p-3 rounded-xl bg-slate-800 text-slate-400 font-bold border border-slate-700 flex items-center justify-center" data-dir="left">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <button type="button" class="preview-dir-btn p-3 rounded-xl bg-slate-800 text-slate-400 font-bold border border-slate-700 flex items-center justify-center" data-dir="down">
            <i data-lucide="arrow-down" class="w-5 h-5"></i>
          </button>
          <button type="button" class="preview-dir-btn p-3 rounded-xl bg-slate-800 text-slate-400 font-bold border border-slate-700 flex items-center justify-center" data-dir="right">
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
        </div>
      `;

      testContent.querySelectorAll('.preview-dir-btn').forEach(btn => {
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleEarlyClick();
        });
      });
      break;

    // ------------------------------------------
    // 4. 위치 반응: 완전한 검은색 대기 화면 (Black Screen)
    // ------------------------------------------
    case 'position':
      setTestAreaState('state-blackout');
      // 시각적 요소 일절 미표시 (텍스트/로더 없음)
      testContent.innerHTML = ``;
      break;

    // ------------------------------------------
    // 5. 도형 반응: 도형 버튼 미리 노출 + 상단 목표 대기
    // ------------------------------------------
    case 'shape':
      setTestAreaState('state-idle');
      const shuffledShapes = modeQuestionData ? modeQuestionData.shuffledShapes : [];
      const previewShapeBtns = shuffledShapes.map(s => `
        <button type="button" class="preview-shape-btn p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-slate-700 font-bold text-white shadow-md flex flex-col items-center justify-center gap-1 opacity-80 cursor-pointer transition-all" data-shape-id="${s.id}">
          <span class="text-3xl sm:text-4xl text-purple-400">${s.symbol}</span>
          <span class="text-xs text-slate-300 font-semibold">${s.name}</span>
        </button>
      `).join('');

      testContent.innerHTML = `
        <div class="mb-4">
          <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">도형 버튼을 확인하세요</span>
          <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base sm:text-lg font-bold bg-slate-900 border border-slate-700 text-slate-300 animate-pulse">
            <i data-lucide="hourglass" class="w-4 h-4 text-purple-400 animate-spin"></i>
            <span>목표 도형 대기 중... (미리 누르면 실패)</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm pointer-events-auto">
          ${previewShapeBtns}
        </div>
      `;

      testContent.querySelectorAll('.preview-shape-btn').forEach(btn => {
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleEarlyClick();
        });
      });
      break;

    // ------------------------------------------
    // 6. 소리 반응: 완전한 검은색 화면 (Blackout - 시각 신호 일절 없음)
    // ------------------------------------------
    case 'audio':
      setTestAreaState('state-blackout');
      // 100% 청각 자극에만 의존하도록 화면 텍스트/신호 완전 제거
      testContent.innerHTML = ``;
      break;

    // ------------------------------------------
    // 7. 홀드 반응 (Hold & Release): 대기 단계
    // ------------------------------------------
    case 'hold-release':
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <div class="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 animate-pulse">
          <i data-lucide="hand" class="w-8 h-8"></i>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">신호를 기다리세요...</h2>
        <p class="text-cyan-200 text-xs sm:text-sm mb-4">화면에 시작 신호가 뜨면 즉시 누르고 유지(Hold)하세요.</p>
        <span class="text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
          ⚠️ 신호가 나오기 전에 누르면 조기 입력 실패입니다.
        </span>
      `;
      break;

    // ------------------------------------------
    // 8. 동시 자극 (Dual Stimuli): 대기 단계
    // ------------------------------------------
    case 'dual-stimuli':
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-4">동시 자극 대기 중</span>
        <div class="flex items-center justify-center gap-10 sm:gap-14 w-full max-w-sm mx-auto mb-5">
          <div class="flex flex-col items-center gap-2">
            <div id="dualCircleA" class="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-slate-700 bg-slate-900 text-slate-500 shadow-inner flex items-center justify-center font-bold transition-all duration-75">
              <span class="text-xs font-bold text-slate-500">A</span>
            </div>
            <span class="text-xs font-semibold text-slate-400">자극 A</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <div id="dualCircleB" class="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-slate-700 bg-slate-900 text-slate-500 shadow-inner flex items-center justify-center font-bold transition-all duration-75">
              <span class="text-xs font-bold text-slate-500">B</span>
            </div>
            <span class="text-xs font-semibold text-slate-400">자극 B</span>
          </div>
        </div>
        <p class="text-xs text-teal-300 font-medium">두 원이 동시에 켜지는 순간 빠르게 클릭하세요!</p>
      `;
      startDualStimuliBlinking(targetWaitDuration);
      break;

    // ------------------------------------------
    // 9. 순서 반전 (Inverted Direction): 대기 단계
    // ------------------------------------------
    case 'inverted-direction':
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <div class="mb-4 text-center">
          <span class="text-xs text-rose-400 font-bold uppercase tracking-wider block mb-1">⚠️ 청개구리 룰: 반대 방향을 입력하세요!</span>
          <div class="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-slate-900/80 border-2 border-slate-700 text-slate-500 flex items-center justify-center animate-pulse">
            <span class="text-4xl sm:text-5xl font-black text-rose-400/50">?</span>
          </div>
          <span class="text-xs font-bold text-slate-400 mt-2 block">목표 방향 대기 중... (↑면 ↓ 입력)</span>
        </div>
        <div class="grid grid-cols-3 gap-2 w-48 mx-auto mt-2 pointer-events-auto">
          <div></div>
          <button type="button" class="preview-dir-btn p-3 rounded-xl bg-slate-800 text-slate-400 font-bold border border-slate-700 flex items-center justify-center" data-dir="up">
            <i data-lucide="arrow-up" class="w-5 h-5"></i>
          </button>
          <div></div>
          <button type="button" class="preview-dir-btn p-3 rounded-xl bg-slate-800 text-slate-400 font-bold border border-slate-700 flex items-center justify-center" data-dir="left">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <button type="button" class="preview-dir-btn p-3 rounded-xl bg-slate-800 text-slate-400 font-bold border border-slate-700 flex items-center justify-center" data-dir="down">
            <i data-lucide="arrow-down" class="w-5 h-5"></i>
          </button>
          <button type="button" class="preview-dir-btn p-3 rounded-xl bg-slate-800 text-slate-400 font-bold border border-slate-700 flex items-center justify-center" data-dir="right">
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
        </div>
      `;
      testContent.querySelectorAll('.preview-dir-btn').forEach(btn => {
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleEarlyClick();
        });
      });
      break;

    // ------------------------------------------
    // 10. 신호 종료 (Signal Offset): 대기 단계 (신호 켜짐 상태)
    // ------------------------------------------
    case 'signal-offset':
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <div class="mb-4 text-center">
          <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-3">신호 소등 대기 중</span>
          <div id="signalOffsetBulb" class="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-[0_0_50px_rgba(251,191,36,0.8)] border-4 border-amber-200/80 flex items-center justify-center">
            <i data-lucide="lightbulb" class="w-14 h-14 text-amber-950"></i>
          </div>
        </div>
        <h3 class="text-base sm:text-lg font-bold text-white mb-1">불빛이 꺼지는 순간 클릭하세요!</h3>
        <p class="text-xs text-slate-400">💡 켜져 있는 동안 누르면 조기 입력 실패입니다.</p>
      `;
      startSignalOffsetFlicker(targetWaitDuration);
      break;

    // ------------------------------------------
    // 11. 압력 타이밍 (Expansion Timing): 대기 단계
    // ------------------------------------------
    case 'expansion-timing':
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-3">압력 타이밍 준비</span>
        <div class="relative w-56 h-56 mx-auto flex items-center justify-center mb-3">
          <div class="absolute w-[220px] h-[220px] rounded-full border-3 border-dashed border-yellow-400/80 shadow-[0_0_20px_rgba(234,179,8,0.3)] pointer-events-none"></div>
          <div class="w-8 h-8 rounded-full bg-yellow-400/40"></div>
        </div>
        <p class="text-xs text-yellow-300 font-medium">내부 원이 점선 링에 딱 닿는 정합 순간에 클릭하세요!</p>
      `;
      break;

    // ------------------------------------------
    // 12. 숫자 출현 (Rapid Number): 대기 단계
    // ------------------------------------------
    case 'rapid-number':
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <div class="mb-3">
          <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">목표 숫자를 기억하세요!</span>
          <div class="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-blue-500/20 text-blue-300 border-2 border-blue-500/50 shadow-xl">
            <span class="text-xs font-bold text-slate-400">목표 숫자:</span>
            <span class="text-3xl font-black text-white font-mono tracking-wider">${rapidTargetNumber}</span>
          </div>
        </div>
        <div class="w-48 h-32 rounded-3xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center mb-3 shadow-inner">
          <span class="text-xs text-slate-500 font-mono">숫자 준비 중...</span>
        </div>
        <p class="text-xs text-blue-300 font-medium">숫자들이 빠르게 교체되다 위 목표 숫자가 뜨면 즉시 클릭하세요!</p>
      `;
      break;
  }

  if (window.lucide) window.lucide.createIcons();
}

// ==========================================
// 9. 모드별 [목표 자극 제시 및 측정 단계 (READY)] 렌더링
// ==========================================
function renderReadyPhase() {
  switch (activeRoundMode) {
    // ------------------------------------------
    // 1. 초록불: 즉시 초록색 전환
    // ------------------------------------------
    case 'green-light':
      setTestAreaState('state-ready');
      testContent.innerHTML = `
        <div class="w-20 h-20 rounded-full bg-white text-emerald-600 flex items-center justify-center mb-5 shadow-2xl animate-bounce-short">
          <i data-lucide="zap" class="w-12 h-12 fill-emerald-600 stroke-none"></i>
        </div>
        <h2 class="text-3xl sm:text-5xl font-black text-slate-950 mb-2 tracking-tight">지금 클릭하세요!</h2>
        <p class="text-emerald-950 font-bold text-base sm:text-lg">CLICK NOW!</p>
      `;
      break;

    // ------------------------------------------
    // 2. 색상 구분: 목표 색상 제시
    // ------------------------------------------
    case 'color-match':
      setTestAreaState('state-idle');
      const targetColor = modeQuestionData.targetColor;
      const shuffledColors = modeQuestionData.shuffledColors;

      const colorBtnsHtml = shuffledColors.map(c => `
        <button type="button" class="color-match-btn p-4 sm:p-5 rounded-2xl font-black text-white text-base sm:text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-white/30 hover:scale-105" data-color-id="${c.id}" style="background-color: ${c.hex}">
          <span>${c.name}</span>
        </button>
      `).join('');

      testContent.innerHTML = `
        <div class="mb-4 animate-scale-up">
          <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">목표 색상을 누르세요!</span>
          <div class="inline-block px-6 py-2 rounded-full text-2xl sm:text-3xl font-black shadow-xl border-2" style="background-color: ${targetColor.hex}22; color: ${targetColor.hex}; border-color: ${targetColor.hex}">
            👉 ${targetColor.name} (${targetColor.nameEn}) 👈
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm">
          ${colorBtnsHtml}
        </div>
      `;

      testContent.querySelectorAll('.color-match-btn').forEach(btn => {
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const selectedId = btn.dataset.colorId;
          handleModeAnswer(selectedId === targetColor.id);
        });
      });
      break;

    // ------------------------------------------
    // 3. 방향 반응: 목표 화살표 제시
    // ------------------------------------------
    case 'direction':
      setTestAreaState('state-idle');
      const targetDir = modeQuestionData.targetDirection;

      testContent.innerHTML = `
        <div class="mb-4 text-center animate-scale-up">
          <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">목표 방향을 입력하세요!</span>
          <div class="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-sky-500/20 border-3 border-sky-400 text-sky-300 flex items-center justify-center shadow-2xl shadow-sky-500/30">
            <span class="text-6xl sm:text-7xl font-black">${targetDir.arrow}</span>
          </div>
          <span class="text-sm font-bold text-sky-200 mt-2 block">${targetDir.name}</span>
        </div>

        <!-- 인터랙티브 방향 D-패드 -->
        <div class="grid grid-cols-3 gap-2 w-48 mx-auto mt-2">
          <div></div>
          <button type="button" class="dir-btn p-3 rounded-xl bg-slate-800 hover:bg-sky-600 active:scale-95 text-white font-bold border border-slate-700 shadow-sm flex items-center justify-center transition-all" data-dir="up">
            <i data-lucide="arrow-up" class="w-5 h-5"></i>
          </button>
          <div></div>

          <button type="button" class="dir-btn p-3 rounded-xl bg-slate-800 hover:bg-sky-600 active:scale-95 text-white font-bold border border-slate-700 shadow-sm flex items-center justify-center transition-all" data-dir="left">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <button type="button" class="dir-btn p-3 rounded-xl bg-slate-800 hover:bg-sky-600 active:scale-95 text-white font-bold border border-slate-700 shadow-sm flex items-center justify-center transition-all" data-dir="down">
            <i data-lucide="arrow-down" class="w-5 h-5"></i>
          </button>
          <button type="button" class="dir-btn p-3 rounded-xl bg-slate-800 hover:bg-sky-600 active:scale-95 text-white font-bold border border-slate-700 shadow-sm flex items-center justify-center transition-all" data-dir="right">
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
        </div>
      `;

      testContent.querySelectorAll('.dir-btn').forEach(btn => {
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const d = btn.dataset.dir;
          handleModeAnswer(d === targetDir.id);
        });
      });
      break;

    // ------------------------------------------
    // 4. 위치 반응: 검은 화면 위에 타겟 원 노출
    // ------------------------------------------
    case 'position':
      setTestAreaState('state-blackout');
      const coords = modeQuestionData.targetCoords;

      testContent.innerHTML = `
        <!-- 클릭 타겟 원 (배경은 완전 검은 화면 유지) -->
        <div id="positionTarget" class="position-target" style="left: ${coords.x}%; top: ${coords.y}%;" title="조준 타겟"></div>
      `;

      const targetEl = document.getElementById('positionTarget');
      if (targetEl) {
        targetEl.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleModeAnswer(true);
        });
      }
      break;

    // ------------------------------------------
    // 5. 도형 반응: 목표 도형 제시
    // ------------------------------------------
    case 'shape':
      setTestAreaState('state-idle');
      const targetShape = modeQuestionData.targetShape;
      const shuffledShapes = modeQuestionData.shuffledShapes;

      const shapeBtnsHtml = shuffledShapes.map(s => `
        <button type="button" class="shape-match-btn p-4 sm:p-5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border-2 border-slate-700 hover:border-purple-500 font-bold text-white shadow-xl active:scale-95 transition-all flex flex-col items-center justify-center gap-1 hover:scale-105" data-shape-id="${s.id}">
          <span class="text-3xl sm:text-4xl text-purple-400">${s.symbol}</span>
          <span class="text-xs text-slate-300 font-semibold">${s.name}</span>
        </button>
      `).join('');

      testContent.innerHTML = `
        <div class="mb-4 animate-scale-up">
          <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">목표 도형을 누르세요!</span>
          <div class="inline-flex items-center gap-2 px-6 py-2 rounded-full text-2xl sm:text-3xl font-black bg-purple-500/20 text-purple-300 border-2 border-purple-500/50 shadow-xl">
            <span>${targetShape.symbol}</span>
            <span>${targetShape.name} (${targetShape.nameEn})</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm">
          ${shapeBtnsHtml}
        </div>
      `;

      testContent.querySelectorAll('.shape-match-btn').forEach(btn => {
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const sId = btn.dataset.shapeId;
          handleModeAnswer(sId === targetShape.id);
        });
      });
      break;

    // ------------------------------------------
    // 6. 소리 반응: 완전한 검은색 화면 유지 (시각 신호 일절 미표시)
    // ------------------------------------------
    case 'audio':
      setTestAreaState('state-blackout');
      // 화면에 '지금 반응하세요', 텍스트, 색상 변화 등 시각 신호 완전 제거 (순수 청각 테스트)
      testContent.innerHTML = ``;
      break;

    // ------------------------------------------
    // 7. 홀드 반응: 1단계 시작 신호 (누르고 유지)
    // ------------------------------------------
    case 'hold-release':
      setTestAreaState('state-ready');
      holdPhase = 'ready-to-press';
      testContent.innerHTML = `
        <div id="holdIconBox" class="w-20 h-20 rounded-full bg-white text-cyan-700 flex items-center justify-center mb-4 shadow-2xl animate-bounce-short">
          <i data-lucide="hand" class="w-12 h-12 stroke-[2.5]"></i>
        </div>
        <h2 id="holdMainTitle" class="text-3xl sm:text-5xl font-black text-slate-950 mb-2 tracking-tight">지금 누르고 유지!</h2>
        <p id="holdSubTitle" class="text-cyan-950 font-bold text-sm sm:text-base">HOLD NOW! (신호 바뀔 때까지 손 떼지 마세요)</p>
      `;
      break;

    // ------------------------------------------
    // 8. 동시 자극: 2개 자극 동시 활성화
    // ------------------------------------------
    case 'dual-stimuli':
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <span class="text-xs text-teal-400 font-bold uppercase tracking-wider block mb-4">⚡ 두 자극 동시 활성화!</span>
        <div class="flex items-center justify-center gap-10 sm:gap-14 w-full max-w-sm mx-auto mb-5">
          <div class="flex flex-col items-center gap-2">
            <div id="dualCircleA" class="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-teal-300 bg-teal-400 text-slate-950 shadow-[0_0_30px_rgba(45,212,191,0.85)] flex items-center justify-center font-black">
              <span class="text-xs font-black text-slate-950">ON</span>
            </div>
            <span class="text-xs font-semibold text-teal-300">자극 A</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <div id="dualCircleB" class="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-teal-300 bg-teal-400 text-slate-950 shadow-[0_0_30px_rgba(45,212,191,0.85)] flex items-center justify-center font-black">
              <span class="text-xs font-black text-slate-950">ON</span>
            </div>
            <span class="text-xs font-semibold text-teal-300">자극 B</span>
          </div>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-white">지금 클릭하세요!</h2>
      `;
      break;

    // ------------------------------------------
    // 9. 순서 반전: 목표 방향 제시 (반대 방향 입력)
    // ------------------------------------------
    case 'inverted-direction': {
      setTestAreaState('state-idle');
      const invTargetDir = modeQuestionData.targetDirection;
      testContent.innerHTML = `
        <div class="mb-4 text-center animate-scale-up">
          <span class="text-xs text-rose-400 font-extrabold uppercase tracking-wider block mb-1">
            제시된 방향의 【반대 방향】을 누르세요!
          </span>
          <div class="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-rose-500/20 border-3 border-rose-500 text-rose-300 flex items-center justify-center shadow-2xl shadow-rose-500/30">
            <span class="text-6xl sm:text-7xl font-black">${invTargetDir.arrow}</span>
          </div>
          <span class="text-sm font-bold text-rose-200 mt-2 block">${invTargetDir.name} ➔ 반대 방향 입력!</span>
        </div>
        <div class="grid grid-cols-3 gap-2 w-48 mx-auto mt-2">
          <div></div>
          <button type="button" class="inverted-dir-btn p-3 rounded-xl bg-slate-800 hover:bg-rose-600 active:scale-95 text-white font-bold border border-slate-700 shadow-sm flex items-center justify-center transition-all" data-dir="up">
            <i data-lucide="arrow-up" class="w-5 h-5"></i>
          </button>
          <div></div>
          <button type="button" class="inverted-dir-btn p-3 rounded-xl bg-slate-800 hover:bg-rose-600 active:scale-95 text-white font-bold border border-slate-700 shadow-sm flex items-center justify-center transition-all" data-dir="left">
            <i data-lucide="arrow-left" class="w-5 h-5"></i>
          </button>
          <button type="button" class="inverted-dir-btn p-3 rounded-xl bg-slate-800 hover:bg-rose-600 active:scale-95 text-white font-bold border border-slate-700 shadow-sm flex items-center justify-center transition-all" data-dir="down">
            <i data-lucide="arrow-down" class="w-5 h-5"></i>
          </button>
          <button type="button" class="inverted-dir-btn p-3 rounded-xl bg-slate-800 hover:bg-rose-600 active:scale-95 text-white font-bold border border-slate-700 shadow-sm flex items-center justify-center transition-all" data-dir="right">
            <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </button>
        </div>
      `;
      testContent.querySelectorAll('.inverted-dir-btn').forEach(btn => {
        btn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const d = btn.dataset.dir;
          handleModeAnswer(d === invTargetDir.oppositeId);
        });
      });
      break;
    }

    // ------------------------------------------
    // 10. 신호 종료: 불빛 소등
    // ------------------------------------------
    case 'signal-offset':
      // STRICT: 시각적 강조 금지! 텍스트 변경, 테두리 강조, 배경 반전, 크기 변화, 플래시 등 불빛 꺼짐 외 시각 힌트 일체 배제
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <div class="mb-4 text-center">
          <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-3">신호 소등 대기 중</span>
          <div id="signalOffsetBulb" class="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-amber-200/80 flex items-center justify-center" style="opacity: 0; box-shadow: none;">
            <i data-lucide="lightbulb" class="w-14 h-14 text-amber-950"></i>
          </div>
        </div>
        <h3 class="text-base sm:text-lg font-bold text-white mb-1">불빛이 꺼지는 순간 클릭하세요!</h3>
        <p class="text-xs text-slate-400">💡 켜져 있는 동안 누르면 조기 입력 실패입니다.</p>
      `;
      break;

    // ------------------------------------------
    // 11. 압력 타이밍: 원 확장 애니메이션 시작
    // ------------------------------------------
    case 'expansion-timing':
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <span class="text-xs text-yellow-400 font-bold uppercase tracking-wider block mb-2">원 정합 타이밍 포착!</span>
        <div class="relative w-64 h-64 mx-auto flex items-center justify-center mb-2">
          <!-- 목표 링 가이드 (직경 220px) -->
          <div class="absolute w-[220px] h-[220px] rounded-full border-4 border-dashed border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.5)] pointer-events-none"></div>
          <!-- 확장되는 내부 원 -->
          <div id="expansionCircle" class="rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 shadow-lg pointer-events-none" style="width: 30px; height: 30px;"></div>
        </div>
        <p class="text-xs text-slate-300 font-medium">내부 원이 점선 링과 일치하는 순간 클릭하세요!</p>
      `;
      break;

    // ------------------------------------------
    // 12. 숫자 출현: 숫자 스트림 컨테이너 렌더링
    // ------------------------------------------
    case 'rapid-number':
      setTestAreaState('state-idle');
      testContent.innerHTML = `
        <div class="mb-2">
          <div class="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-md">
            <span class="text-xs font-bold text-slate-400">목표 숫자:</span>
            <span class="text-2xl font-black text-white font-mono tracking-wider">${rapidTargetNumber}</span>
          </div>
        </div>
        <div id="rapidNumberDisplayBox" class="w-48 h-32 rounded-3xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center mb-3 shadow-2xl">
          <span id="rapidNumberText" class="text-5xl sm:text-6xl font-black text-slate-100 font-mono tracking-widest">-</span>
        </div>
        <p class="text-xs text-blue-300 font-medium">목표 숫자 [${rapidTargetNumber}]가 나오면 즉시 클릭!</p>
      `;
      break;
  }

  if (window.lucide) window.lucide.createIcons();
}

// ==========================================
// 10. 게임 라운드 제어 로직
// ==========================================
function startTest() {
  // 브라우저 AudioContext 권한 확보 (User Gesture 시점)
  sounds.init();

  currentRound = 1;
  roundResults = [];
  roundDetails = [];
  roundSuccessCount = 0;
  falseStarts = 0;
  if (currentMode === 'random') {
    // 설정된 반복 횟수만큼 무작위 모드 세션 생성 (중복 허용)
    randomSequence = Array.from({ length: currentSettings.totalRounds }, () => MULTI_MODE_POOL[Math.floor(Math.random() * MULTI_MODE_POOL.length)]);
  } else if (currentMode === 'custom-sequence') {
    ensureCustomSequenceLength(currentSettings.totalRounds);
  }
  startRound();
}

function clearAllTimers() {
  if (waitTimeoutId) {
    clearTimeout(waitTimeoutId);
    waitTimeoutId = null;
  }
  if (decoyTimeoutId) {
    clearTimeout(decoyTimeoutId);
    decoyTimeoutId = null;
  }
  if (missedTimeoutId) {
    clearTimeout(missedTimeoutId);
    missedTimeoutId = null;
  }
  if (holdSignalTimeoutId) {
    clearTimeout(holdSignalTimeoutId);
    holdSignalTimeoutId = null;
  }
  if (holdReleaseTimeoutId) {
    clearTimeout(holdReleaseTimeoutId);
    holdReleaseTimeoutId = null;
  }
  if (expansionAnimFrameId) {
    cancelAnimationFrame(expansionAnimFrameId);
    expansionAnimFrameId = null;
  }
  if (rapidNumberIntervalId) {
    clearInterval(rapidNumberIntervalId);
    rapidNumberIntervalId = null;
  }
  if (rapidNumberTimeoutId) {
    clearTimeout(rapidNumberTimeoutId);
    rapidNumberTimeoutId = null;
  }
  holdIsHeld = false;
  rapidIsTargetActive = false;

  if (dualTimerA) {
    clearTimeout(dualTimerA);
    dualTimerA = null;
  }
  if (dualTimerB) {
    clearTimeout(dualTimerB);
    dualTimerB = null;
  }
  if (dualSyncTimeoutId) {
    clearTimeout(dualSyncTimeoutId);
    dualSyncTimeoutId = null;
  }
  if (dualTimeoutId) {
    clearTimeout(dualTimeoutId);
    dualTimeoutId = null;
  }
  dualStateA = false;
  dualStateB = false;
  dualIsSimultaneous = false;

  if (signalOffsetFlickerTimeoutId) {
    clearTimeout(signalOffsetFlickerTimeoutId);
    signalOffsetFlickerTimeoutId = null;
  }
  if (signalOffsetFadeTimeoutId) {
    clearTimeout(signalOffsetFadeTimeoutId);
    signalOffsetFadeTimeoutId = null;
  }
  if (signalOffsetTimeoutId) {
    clearTimeout(signalOffsetTimeoutId);
    signalOffsetTimeoutId = null;
  }
  signalOffsetExtinguished = false;
}

function startRound(remainingTime = null) {
  clearAllTimers();
  isAudioTargetPlaying = false;

  if (remainingTime === null) {
    if (currentMode === 'random') {
      const rIdx = Math.min(randomSequence.length - 1, Math.max(0, currentRound - 1));
      activeRoundMode = randomSequence[rIdx] || MULTI_MODE_POOL[Math.floor(Math.random() * MULTI_MODE_POOL.length)];
    } else if (currentMode === 'custom-sequence') {
      const seqIndex = Math.min(customSequence.length - 1, Math.max(0, currentRound - 1));
      activeRoundMode = customSequence[seqIndex] || 'color-match';
    } else {
      activeRoundMode = currentMode;
    }
  }

  // 매 회차 새로운 문제 배치 사전 생성
  setupModeQuestionData();

  if (remainingTime !== null && remainingTime > 100) {
    targetWaitDuration = remainingTime;
  } else {
    const minMs = currentSettings.minWaitSec * 1000;
    const maxMs = currentSettings.maxWaitSec * 1000;
    targetWaitDuration = minMs + Math.random() * (maxMs - minMs);
  }

  waitStartTime = performance.now();
  renderState(STATES.WAITING);

  // 초록불 모드 대기 진입 틱 사운드
  if (activeRoundMode === 'green-light') {
    sounds.playReady();
  }


  // 무작위 대기 종료 -> 실제 자극 제시 및 측정 단계로 전환
  waitTimeoutId = setTimeout(() => {
    triggerReadyPhase();
  }, targetWaitDuration);
}

function triggerDecoyFlash() {
  renderState(STATES.DECOY);
  sounds.playDecoy();

  setTimeout(() => {
    if (currentState === STATES.DECOY) {
      renderState(STATES.WAITING);
    }
  }, 160);
}

function triggerReadyPhase() {
  if (currentState !== STATES.WAITING) return;
  clearAllTimers();

  if (activeRoundMode === 'audio') {
    isAudioTargetPlaying = false;
    renderState(STATES.READY_TO_CLICK);
    sounds.playTargetSound().then((audioStartTime) => {
      isAudioTargetPlaying = true;
      startTime = audioStartTime;
    }).catch((err) => {
      console.error('소리 반응 테스트 목표 사운드 재생 오류:', err);
      isAudioTargetPlaying = true;
      startTime = performance.now();
    });
  } else if (activeRoundMode === 'hold-release') {
    holdPhase = 'ready-to-press';
    holdIsHeld = false;
    renderState(STATES.READY_TO_CLICK);
    holdPressStartTime = performance.now();
    startTime = holdPressStartTime;
    sounds.playGo();
  } else if (activeRoundMode === 'expansion-timing') {
    renderState(STATES.READY_TO_CLICK);
    expansionAnimStartTime = performance.now();
    expansionTargetHitTime = expansionAnimStartTime + expansionDurationMs;
    startTime = expansionAnimStartTime;
    sounds.playGo();
    startExpansionAnimation();
  } else if (activeRoundMode === 'rapid-number') {
    renderState(STATES.READY_TO_CLICK);
    startTime = performance.now();
    startRapidNumberStream();
  } else if (activeRoundMode === 'dual-stimuli') {
    triggerDualSimultaneous();
  } else if (activeRoundMode === 'signal-offset') {
    triggerSignalOffsetExtinction();
  } else {
    renderState(STATES.READY_TO_CLICK);
    startTime = performance.now();
    sounds.playGo();
  }

}

// ------------------------------------------
// 신규 6종 모드 전용 실행 제어 함수들
// ------------------------------------------

// 1. 압력 타이밍: 원 확장 애니메이션 루프
function startExpansionAnimation() {
  const circleEl = document.getElementById('expansionCircle');
  if (!circleEl) return;

  const initialDiameter = 30;
  const targetDiameter = 220; // 220px 링 가이드와 100% 일치

  function step(now) {
    if (currentState !== STATES.READY_TO_CLICK || activeRoundMode !== 'expansion-timing') {
      return;
    }
    const elapsed = now - expansionAnimStartTime;
    const progress = elapsed / expansionDurationMs;
    const currentDiameter = Math.max(10, Math.round(initialDiameter + (targetDiameter - initialDiameter) * progress));
    expansionCurrentRadius = currentDiameter / 2;

    circleEl.style.width = `${currentDiameter}px`;
    circleEl.style.height = `${currentDiameter}px`;

    // 링 크기를 초과(+240ms 초과)하면 지연 반응 / 시간 초과 처리
    if (elapsed > expansionDurationMs + 240) {
      clearAllTimers();
      sounds.playFail();
      falseStarts++;
      const diffMs = Math.round(elapsed - expansionDurationMs);
      handleModeAnswer(false, { isTimeout: true, timingDiff: diffMs, earlyOrLate: 'Late' });
      return;
    }

    expansionAnimFrameId = requestAnimationFrame(step);
  }

  expansionAnimFrameId = requestAnimationFrame(step);
}

// 2. 숫자 출현: 연속 스트림 루프 (목표 숫자 놓쳐도 종료 없이 계속 순환)
function startRapidNumberStream() {
  const numberText = document.getElementById('rapidNumberText');
  const boxEl = document.getElementById('rapidNumberDisplayBox');
  if (!numberText || !boxEl) return;

  rapidIsTargetActive = false;
  const dummyIntervalMs = 380;
  const targetDurationMs = 460;
  const useThreeDigits = rapidTargetNumber >= 100;

  let dummiesRemaining = Math.floor(3 + Math.random() * 4);

  function tick() {
    if (currentState !== STATES.READY_TO_CLICK || activeRoundMode !== 'rapid-number') {
      return;
    }

    if (dummiesRemaining > 0) {
      rapidIsTargetActive = false;
      let dummyNum;
      do {
        dummyNum = useThreeDigits ? Math.floor(100 + Math.random() * 900) : Math.floor(10 + Math.random() * 90);
      } while (dummyNum === rapidTargetNumber);

      rapidCurrentNumber = dummyNum;
      numberText.textContent = dummyNum;
      dummiesRemaining--;

      rapidNumberTimeoutId = setTimeout(tick, dummyIntervalMs);
    } else {
      // 목표 숫자 표시 (더미 숫자와 100% 동일한 CSS/스타일 유지 - 테두리/색상/효과 변경 절대 금지)
      rapidIsTargetActive = true;
      rapidCurrentNumber = rapidTargetNumber;
      rapidTargetAppearTime = performance.now();
      numberText.textContent = rapidTargetNumber;

      rapidNumberTimeoutId = setTimeout(() => {
        if (currentState !== STATES.READY_TO_CLICK || activeRoundMode !== 'rapid-number') {
          return;
        }
        // 사용자가 목표 숫자를 놓친 경우: 실패 처리하지 않고 더미 숫자 스트림 계속 진행
        rapidIsTargetActive = false;
        dummiesRemaining = Math.floor(4 + Math.random() * 4);
        tick();
      }, targetDurationMs);
    }
  }

  rapidNumberTimeoutId = setTimeout(tick, 250);
}

// 3. 동시 자극: 원 상태 및 독립 점멸 제어
function setDualCircleState(circleId, isOn) {
  const el = document.getElementById(circleId);
  if (!el) return;
  if (isOn) {
    el.className = 'w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-teal-300 bg-teal-400 text-slate-950 shadow-[0_0_30px_rgba(45,212,191,0.85)] flex items-center justify-center font-black transition-all duration-75';
    el.innerHTML = '<span class="text-xs font-black text-slate-950">ON</span>';
  } else {
    el.className = 'w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-slate-700 bg-slate-900 text-slate-500 shadow-inner flex items-center justify-center font-bold transition-all duration-75';
    el.innerHTML = `<span class="text-xs font-bold text-slate-500">${circleId === 'dualCircleA' ? 'A' : 'B'}</span>`;
  }
}

function startDualStimuliBlinking(totalWaitMs) {
  if (dualTimerA) clearTimeout(dualTimerA);
  if (dualTimerB) clearTimeout(dualTimerB);
  dualStateA = false;
  dualStateB = false;
  dualIsSimultaneous = false;

  const syncTime = performance.now() + totalWaitMs;

  function cycleA() {
    if (currentState !== STATES.WAITING || activeRoundMode !== 'dual-stimuli') return;
    const remaining = syncTime - performance.now();
    if (remaining <= 150) return;

    if (!dualStateA) {
      if (dualStateB) {
        dualTimerA = setTimeout(cycleA, 120 + Math.random() * 150);
        return;
      }
      dualStateA = true;
      setDualCircleState('dualCircleA', true);
      const onDuration = Math.min(remaining - 50, 220 + Math.random() * 300);
      dualTimerA = setTimeout(cycleA, onDuration);
    } else {
      dualStateA = false;
      setDualCircleState('dualCircleA', false);
      const offDuration = Math.min(remaining - 50, 260 + Math.random() * 400);
      dualTimerA = setTimeout(cycleA, offDuration);
    }
  }

  function cycleB() {
    if (currentState !== STATES.WAITING || activeRoundMode !== 'dual-stimuli') return;
    const remaining = syncTime - performance.now();
    if (remaining <= 150) return;

    if (!dualStateB) {
      if (dualStateA) {
        dualTimerB = setTimeout(cycleB, 140 + Math.random() * 160);
        return;
      }
      dualStateB = true;
      setDualCircleState('dualCircleB', true);
      const onDuration = Math.min(remaining - 50, 240 + Math.random() * 320);
      dualTimerB = setTimeout(cycleB, onDuration);
    } else {
      dualStateB = false;
      setDualCircleState('dualCircleB', false);
      const offDuration = Math.min(remaining - 50, 280 + Math.random() * 420);
      dualTimerB = setTimeout(cycleB, offDuration);
    }
  }

  dualTimerA = setTimeout(cycleA, 180 + Math.random() * 250);
  dualTimerB = setTimeout(cycleB, 420 + Math.random() * 300);
}

function triggerDualSimultaneous() {
  if (dualTimerA) { clearTimeout(dualTimerA); dualTimerA = null; }
  if (dualTimerB) { clearTimeout(dualTimerB); dualTimerB = null; }
  if (dualTimeoutId) { clearTimeout(dualTimeoutId); dualTimeoutId = null; }

  dualStateA = true;
  dualStateB = true;
  dualIsSimultaneous = true;
  currentState = STATES.READY_TO_CLICK;
  renderReadyPhase();
  startTime = performance.now();
  sounds.playGo();

  const allowanceMs = 1250;
  dualTimeoutId = setTimeout(() => {
    if (currentState === STATES.READY_TO_CLICK && activeRoundMode === 'dual-stimuli' && dualIsSimultaneous) {
      clearAllTimers();
      sounds.playFail();
      falseStarts++;
      handleModeAnswer(false, { isTimeout: true });
    }
  }, allowanceMs);
}

// 4. 신호 종료: 불규칙 밝기 플리커 및 완전 소등 제어
function startSignalOffsetFlicker(totalWaitMs) {
  if (signalOffsetFlickerTimeoutId) clearTimeout(signalOffsetFlickerTimeoutId);
  if (signalOffsetFadeTimeoutId) clearTimeout(signalOffsetFadeTimeoutId);
  if (signalOffsetTimeoutId) clearTimeout(signalOffsetTimeoutId);
  signalOffsetExtinguished = false;

  const bulbEl = document.getElementById('signalOffsetBulb');
  if (!bulbEl) return;

  const fadeDuration = 380;
  const fadeStartTime = Math.max(300, totalWaitMs - fadeDuration);
  const flickerEndTime = performance.now() + fadeStartTime;

  function flickerStep() {
    if (currentState !== STATES.WAITING || activeRoundMode !== 'signal-offset') return;
    const now = performance.now();
    if (now >= flickerEndTime) return;

    const op = 0.35 + Math.random() * 0.65;
    const glowPx = Math.round(15 + Math.random() * 35);
    const glowAlpha = (0.4 + Math.random() * 0.5).toFixed(2);
    bulbEl.style.opacity = op.toFixed(2);
    bulbEl.style.boxShadow = `0 0 ${glowPx}px rgba(251, 191, 36, ${glowAlpha})`;

    const nextDelay = 90 + Math.random() * 170;
    signalOffsetFlickerTimeoutId = setTimeout(flickerStep, nextDelay);
  }

  flickerStep();

  signalOffsetFadeTimeoutId = setTimeout(() => {
    if (currentState !== STATES.WAITING || activeRoundMode !== 'signal-offset') return;
    if (signalOffsetFlickerTimeoutId) {
      clearTimeout(signalOffsetFlickerTimeoutId);
      signalOffsetFlickerTimeoutId = null;
    }
    bulbEl.style.transition = `opacity ${fadeDuration}ms linear, box-shadow ${fadeDuration}ms linear`;
    bulbEl.style.opacity = '0';
    bulbEl.style.boxShadow = 'none';
  }, fadeStartTime);
}

function triggerSignalOffsetExtinction() {
  if (signalOffsetFlickerTimeoutId) { clearTimeout(signalOffsetFlickerTimeoutId); signalOffsetFlickerTimeoutId = null; }
  if (signalOffsetFadeTimeoutId) { clearTimeout(signalOffsetFadeTimeoutId); signalOffsetFadeTimeoutId = null; }
  if (signalOffsetTimeoutId) { clearTimeout(signalOffsetTimeoutId); signalOffsetTimeoutId = null; }

  const bulbEl = document.getElementById('signalOffsetBulb');
  if (bulbEl) {
    bulbEl.style.opacity = '0';
    bulbEl.style.boxShadow = 'none';
  }

  signalOffsetExtinguished = true;
  currentState = STATES.READY_TO_CLICK;
  startTime = performance.now();
  // STRICT: 시각적 강조 금지 및 청각적 신호음(playGo) 배제

  const timeoutLimit = 1400;
  signalOffsetTimeoutId = setTimeout(() => {
    if (currentState === STATES.READY_TO_CLICK && activeRoundMode === 'signal-offset' && signalOffsetExtinguished) {
      clearAllTimers();
      sounds.playFail();
      falseStarts++;
      handleModeAnswer(false, { isTimeout: true });
    }
  }, timeoutLimit);
}

// 3. 홀드 반응: 누르기 및 떼기 신호 제어
function handleHoldPress() {
  if (currentState !== STATES.READY_TO_CLICK || activeRoundMode !== 'hold-release') return;
  if (holdPhase !== 'ready-to-press') return;

  holdIsHeld = true;
  holdPhase = 'holding';
  holdPressReactionTime = Math.max(1, Math.round(performance.now() - holdPressStartTime));

  sounds.playReady();

  // 화면을 [누른 상태 유지 중... 신호가 바뀌면 손을 떼세요!]로 변경
  setTestAreaState('state-paused');
  const iconBox = document.getElementById('holdIconBox');
  const mainTitle = document.getElementById('holdMainTitle');
  const subTitle = document.getElementById('holdSubTitle');
  if (iconBox) iconBox.className = 'w-20 h-20 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center mb-4 shadow-2xl animate-pulse';
  if (mainTitle) {
    mainTitle.textContent = `유지 중! ⏱️ (누름: ${holdPressReactionTime}ms)`;
    mainTitle.className = 'text-2xl sm:text-4xl font-black text-cyan-200 mb-2 tracking-tight';
  }
  if (subTitle) {
    subTitle.textContent = '신호가 주황색으로 바뀌는 순간 즉시 손을 떼세요!';
    subTitle.className = 'text-cyan-300 font-bold text-sm sm:text-base';
  }

  // 일정 시간 후 떼기 신호 트리거
  const holdDuration = modeQuestionData ? modeQuestionData.holdDuration : 1500;
  holdSignalTimeoutId = setTimeout(() => {
    triggerHoldReleaseSignal();
  }, holdDuration);
}

function triggerHoldReleaseSignal() {
  if (currentState !== STATES.READY_TO_CLICK || activeRoundMode !== 'hold-release') return;
  if (holdPhase !== 'holding') return;

  holdPhase = 'ready-to-release';
  holdReleaseStartTime = performance.now();
  sounds.playGo();

  setTestAreaState('state-ready');
  const iconBox = document.getElementById('holdIconBox');
  const mainTitle = document.getElementById('holdMainTitle');
  const subTitle = document.getElementById('holdSubTitle');
  if (iconBox) {
    iconBox.className = 'w-20 h-20 rounded-full bg-rose-500 text-white flex items-center justify-center mb-4 shadow-2xl animate-bounce-short';
    iconBox.innerHTML = '<i data-lucide="arrow-up-circle" class="w-12 h-12 stroke-[2.5]"></i>';
  }
  if (mainTitle) {
    mainTitle.textContent = '지금 손을 떼세요! 💥';
    mainTitle.className = 'text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight';
  }
  if (subTitle) {
    subTitle.textContent = 'RELEASE NOW!';
    subTitle.className = 'text-emerald-950 font-black text-base sm:text-lg';
  }
  if (window.lucide) window.lucide.createIcons();

  // 1400ms 내에 떼지 않으면 시간 초과
  holdReleaseTimeoutId = setTimeout(() => {
    if (holdPhase === 'ready-to-release') {
      clearAllTimers();
      sounds.playFail();
      falseStarts++;
      handleModeAnswer(false, { isTimeout: true, failReason: 'timeout-release' });
    }
  }, 1400);
}

function handleHoldRelease() {
  if (currentState !== STATES.READY_TO_CLICK || activeRoundMode !== 'hold-release') return;
  if (!holdIsHeld) return;
  holdIsHeld = false;

  if (holdPhase === 'holding') {
    // 신호가 바뀌기 전에 뗐음 -> 조기 해제 실패!
    clearAllTimers();
    sounds.playFail();
    falseStarts++;
    handleModeAnswer(false, { isEarlyRelease: true });
    return;
  }

  if (holdPhase === 'ready-to-release') {
    // 정상 떼기 성공!
    clearAllTimers();
    holdReleaseReactionTime = Math.max(1, Math.round(performance.now() - holdReleaseStartTime));
    holdPhase = 'done';

    const avgReactionTime = Math.round((holdPressReactionTime + holdReleaseReactionTime) / 2);
    handleModeAnswer(true, {
      reactionTime: avgReactionTime,
      holdPressTime: holdPressReactionTime,
      holdReleaseTime: holdReleaseReactionTime
    });
  }
}

// 모드별 문제 무작위 생성
function setupModeQuestionData() {
  if (activeRoundMode === 'color-match') {
    const colors = [
      { id: 'red', name: '빨강', nameEn: 'RED', hex: '#ef4444' },
      { id: 'blue', name: '파랑', nameEn: 'BLUE', hex: '#3b82f6' },
      { id: 'green', name: '초록', nameEn: 'GREEN', hex: '#10b981' },
      { id: 'yellow', name: '노랑', nameEn: 'YELLOW', hex: '#eab308' }
    ];
    const target = colors[Math.floor(Math.random() * colors.length)];
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    modeQuestionData = { targetColor: target, shuffledColors: shuffled };

  } else if (activeRoundMode === 'direction') {
    const dirs = [
      { id: 'up', name: '위쪽', arrow: '↑', keyDesc: 'ArrowUp / W' },
      { id: 'down', name: '아래쪽', arrow: '↓', keyDesc: 'ArrowDown / S' },
      { id: 'left', name: '왼쪽', arrow: '←', keyDesc: 'ArrowLeft / A' },
      { id: 'right', name: '오른쪽', arrow: '→', keyDesc: 'ArrowRight / D' }
    ];
    const target = dirs[Math.floor(Math.random() * dirs.length)];
    modeQuestionData = { targetDirection: target };

  } else if (activeRoundMode === 'position') {
    const randX = Math.round(18 + Math.random() * 64);
    const randY = Math.round(22 + Math.random() * 56);
    modeQuestionData = { targetCoords: { x: randX, y: randY } };

  } else if (activeRoundMode === 'shape') {
    const shapes = [
      { id: 'circle', name: '원', nameEn: 'Circle', symbol: '●' },
      { id: 'square', name: '사각형', nameEn: 'Square', symbol: '■' },
      { id: 'triangle', name: '삼각형', nameEn: 'Triangle', symbol: '▲' },
      { id: 'star', name: '별', nameEn: 'Star', symbol: '★' }
    ];
    const target = shapes[Math.floor(Math.random() * shapes.length)];
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    modeQuestionData = { targetShape: target, shuffledShapes: shuffled };

  } else if (activeRoundMode === 'hold-release') {
    holdPhase = 'waiting';
    holdIsHeld = false;
    const holdDuration = 1200 + Math.random() * 1200; // 1.2초 ~ 2.4초 후 떼기 신호
    modeQuestionData = { holdDuration };

  } else if (activeRoundMode === 'dual-stimuli') {
    modeQuestionData = { dualStimuli: true };

  } else if (activeRoundMode === 'inverted-direction') {
    const dirs = [
      { id: 'up', name: '위쪽', arrow: '↑', oppositeId: 'down', oppositeName: '아래쪽', oppositeArrow: '↓' },
      { id: 'down', name: '아래쪽', arrow: '↓', oppositeId: 'up', oppositeName: '위쪽', oppositeArrow: '↑' },
      { id: 'left', name: '왼쪽', arrow: '←', oppositeId: 'right', oppositeName: '오른쪽', oppositeArrow: '→' },
      { id: 'right', name: '오른쪽', arrow: '→', oppositeId: 'left', oppositeName: '왼쪽', oppositeArrow: '←' }
    ];
    const target = dirs[Math.floor(Math.random() * dirs.length)];
    modeQuestionData = { targetDirection: target };

  } else if (activeRoundMode === 'signal-offset') {
    modeQuestionData = { signalActive: true };

  } else if (activeRoundMode === 'expansion-timing') {
    expansionTargetRadius = 110;
    expansionCurrentRadius = 15;
    expansionDurationMs = 1350; // 1.35초 동안 확장하여 목표에 정합
    modeQuestionData = { targetRadius: expansionTargetRadius, duration: expansionDurationMs };

  } else if (activeRoundMode === 'rapid-number') {
    const useThreeDigits = Math.random() < 0.25;
    const targetNum = useThreeDigits ? Math.floor(100 + Math.random() * 900) : Math.floor(10 + Math.random() * 90);
    rapidTargetNumber = targetNum;
    rapidIsTargetActive = false;
    modeQuestionData = { targetNumber: targetNum };

  } else {
    modeQuestionData = null;
  }
}

// 조기 클릭 처리 (WAITING 상태에서 미리 눌렀을 때)
function handleEarlyClick() {
  clearAllTimers();
  falseStarts++;
  sounds.playFail();
  renderState(STATES.EARLY_CLICK, { isDecoy: false });
}

// 모드별 정답/오답 판정
function handleModeAnswer(isCorrect, extraInfo = {}) {
  if (currentState !== STATES.READY_TO_CLICK) return;
  clearAllTimers();

  if (!isCorrect) {
    // 오답 선택 시 정답 처리 및 다음 회차 이동을 즉시 차단하고 오답 실패 처리 (동일 회차 재시도)
    falseStarts++;
    sounds.playFail();
    renderState(STATES.MISSED, { isWrong: true, roundMode: activeRoundMode, ...extraInfo });
    return;
  }

  // 정답인 경우에만 정상 반응시간 기록 및 전환 화면으로 진행
  const reactionTime = extraInfo.reactionTime || Math.max(1, Math.round(performance.now() - startTime));
  roundResults.push(reactionTime);
  roundDetails.push({
    round: currentRound,
    mode: activeRoundMode,
    reactionTime,
    isCorrect: true,
    ...extraInfo
  });

  roundSuccessCount++;
  sounds.playSuccess();

  // 각 회차 측정 직후 회차 전환 화면(Intermission / Next Step Screen) 표시
  renderState(STATES.ROUND_RESULT, {
    reactionTime,
    resultStatus: 'correct',
    roundIndex: currentRound,
    roundMode: activeRoundMode,
    ...extraInfo
  });
}

// ==========================================
// 11. 일시정지 및 홈 초기화
// ==========================================
function pauseTest() {
  if (currentState === STATES.IDLE || currentState === STATES.SUMMARY || currentState === STATES.PAUSED) {
    return;
  }

  previousState = currentState;
  sounds.playPause();

  if (currentState === STATES.WAITING || currentState === STATES.DECOY) {
    const elapsed = performance.now() - waitStartTime;
    remainingWaitDuration = Math.max(200, targetWaitDuration - elapsed);
    clearAllTimers();
  } else if (currentState === STATES.READY_TO_CLICK) {
    remainingWaitDuration = 800;
    previousState = STATES.WAITING;
    clearAllTimers();
  } else {
    clearAllTimers();
  }

  renderState(STATES.PAUSED);
}

function resumeTest() {
  if (currentState !== STATES.PAUSED) return;

  if (previousState === STATES.WAITING || previousState === STATES.DECOY) {
    startRound(remainingWaitDuration);
  } else if (previousState === STATES.ROUND_RESULT) {
    renderState(STATES.ROUND_RESULT, lastRoundResultData || { reactionTime: 0, resultStatus: 'correct', roundIndex: currentRound });
  } else {
    startRound();
  }
}

function resetToHome(playTone = true) {
  clearAllTimers();
  currentRound = 1;
  roundResults = [];
  roundSuccessCount = 0;
  falseStarts = 0;
  remainingWaitDuration = 0;
  lastRoundResultData = null;
  previousState = STATES.IDLE;
  if (playTone) sounds.playTone(380, 'sine', 0.12, 0.1);
  renderState(STATES.IDLE);
}

// 회차 전환 화면에서 [다음으로] 또는 [최종 결과 확인하기] 진행
function proceedFromRoundResult() {
  if (currentState !== STATES.ROUND_RESULT || isProceedingRound) return;
  isProceedingRound = true;

  clearAllTimers();
  lastRoundResultData = null;

  setTimeout(() => {
    isProceedingRound = false;
  }, 250);

  if (currentRound < currentSettings.totalRounds) {
    currentRound++;
    startRound();
  } else {
    renderState(STATES.SUMMARY);
  }
}

// ==========================================
// 12. 메인 인터랙션 핸들러
// ==========================================
function handleInteraction() {
  if (!helpModal.classList.contains('hidden') || 
      !settingsModal.classList.contains('hidden') || 
      !analyticsModal.classList.contains('hidden') || 
      !resetConfirmModal.classList.contains('hidden') ||
      !quitConfirmModal.classList.contains('hidden')) {
    return;
  }

  sounds.init();

  switch (currentState) {
    case STATES.IDLE:
      startTest();
      break;

    case STATES.WAITING:
      // green-light, position, audio 모드에서 자극 전 화면 클릭 시 조기 클릭 처리
      handleEarlyClick();
      break;

    case STATES.DECOY:
      clearAllTimers();
      falseStarts++;
      sounds.playFail();
      renderState(STATES.EARLY_CLICK, { isDecoy: true });
      break;

    case STATES.EARLY_CLICK:
    case STATES.MISSED:
      startRound();
      break;

    case STATES.READY_TO_CLICK:
      // 소리 반응 모드에서 실제 사운드 출력 전 입력 시 조기 클릭 처리
      if (activeRoundMode === 'audio' && !isAudioTargetPlaying) {
        handleEarlyClick();
        return;
      }

      // 1. 홀드 반응 모드: 누르기 시작 처리
      if (activeRoundMode === 'hold-release') {
        handleHoldPress();
        return;
      }

      // 2. 압력 타이밍 모드: 목표 정합 순간 오차(Diff ms) 계산
      if (activeRoundMode === 'expansion-timing') {
        if (expansionAnimFrameId) cancelAnimationFrame(expansionAnimFrameId);
        const userNow = performance.now();
        const diffMs = Math.round(userNow - expansionTargetHitTime);
        const absDiff = Math.abs(diffMs);
        const earlyOrLate = diffMs < 0 ? 'Early' : diffMs > 0 ? 'Late' : 'Perfect';

        if (diffMs < -100) {
          // 접촉 이전 클릭(조기 반응): -100ms보다 이르게 누른 경우 즉시 실패
          clearAllTimers();
          falseStarts++;
          sounds.playFail();
          handleModeAnswer(false, { isEarly: true, timingDiff: diffMs, earlyOrLate: 'Early' });
          return;
        }

        if (diffMs > 220) {
          // 허용 범위를 초과하여 너무 늦게 누른 경우 실패
          clearAllTimers();
          falseStarts++;
          sounds.playFail();
          handleModeAnswer(false, { isTimeout: true, timingDiff: diffMs, earlyOrLate: 'Late' });
          return;
        }

        // 정상 접촉 허용 범위 (-100ms ~ +220ms) 내에 들어왔을 때만 성공으로 판정
        clearAllTimers();
        handleModeAnswer(true, {
          reactionTime: absDiff,
          timingDiff: diffMs,
          earlyOrLate: earlyOrLate
        });
        return;
      }

      // 3. 숫자 출현 모드: 목표 숫자 활성 여부 판정
      if (activeRoundMode === 'rapid-number') {
        if (rapidIsTargetActive) {
          clearAllTimers();
          const reactionTime = Math.max(1, Math.round(performance.now() - rapidTargetAppearTime));
          handleModeAnswer(true, { reactionTime });
        } else {
          // 더미 숫자 표시 중 누름 -> 오답 실패 처리
          clearAllTimers();
          falseStarts++;
          sounds.playFail();
          handleModeAnswer(false, { isWrong: true });
        }
        return;
      }

      // 4. 동시 자극 모드: 동시 점등 상태 확인
      if (activeRoundMode === 'dual-stimuli') {
        if (!dualIsSimultaneous) {
          handleEarlyClick();
          return;
        }
        clearAllTimers();
        const reactionTime = Math.max(1, Math.round(performance.now() - startTime));
        handleModeAnswer(true, { reactionTime });
        return;
      }

      // 5. 신호 종료 모드: 소등 완료 상태 확인
      if (activeRoundMode === 'signal-offset') {
        if (!signalOffsetExtinguished) {
          handleEarlyClick();
          return;
        }
        clearAllTimers();
        const reactionTime = Math.max(1, Math.round(performance.now() - startTime));
        handleModeAnswer(true, { reactionTime });
        return;
      }

      // 6. 단일 화면 클릭 완료 모드: green-light, audio
      if (activeRoundMode === 'green-light' || activeRoundMode === 'audio') {
        clearAllTimers();
        const reactionTime = Math.max(1, Math.round(performance.now() - startTime));
        handleModeAnswer(true, { reactionTime });
      }
      break;

    case STATES.ROUND_RESULT:
      // 전환 화면 상태에서 마우스 화면 클릭 또는 키보드 입력 시 다음 단계로 진행
      proceedFromRoundResult();
      break;

    case STATES.PAUSED:
      break;

    case STATES.SUMMARY:
      break;
  }
}

// ==========================================
// 13. 종합 결과 대시보드 및 Chart.js 렌더링
// ==========================================
function renderSummaryDashboard() {
  const modeInfo = TEST_MODES[currentMode];
  const sum = roundResults.reduce((acc, cur) => acc + cur, 0);
  const avg = roundResults.length > 0 ? Math.round(sum / roundResults.length) : 0;
  const best = roundResults.length > 0 ? Math.min(...roundResults) : 0;
  const worst = roundResults.length > 0 ? Math.max(...roundResults) : 0;

  const totalAttempts = roundResults.length + falseStarts;
  const accuracy = totalAttempts > 0 ? Math.round((roundSuccessCount / totalAttempts) * 100) : 100;

  const sessionData = {
    id: Date.now(),
    date: formatCurrentDateTime(),
    testType: currentMode,
    totalRounds: currentSettings.totalRounds,
    minWaitSec: currentSettings.minWaitSec,
    maxWaitSec: currentSettings.maxWaitSec,
    avgTime: avg,
    bestTime: best,
    worstTime: worst,
    accuracy: accuracy,
    falseStarts: falseStarts,
    roundResults: [...roundResults]
  };

  const isNewPb = saveSessionResult(sessionData);

  sounds.playCelebrate();
  if (typeof confetti === 'function') {
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
  }

  let typeSummaryHtml = '';
  if (currentMode === 'random' || currentMode === 'custom-sequence') {
    const typeCounts = {};
    roundDetails.forEach(d => {
      const m = d.mode || activeRoundMode;
      typeCounts[m] = (typeCounts[m] || 0) + 1;
    });
    const chips = Object.entries(typeCounts).map(([mId, count]) => {
      const mInfo = TEST_MODES[mId] || TEST_MODES['green-light'];
      return `
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-semibold text-slate-300 shadow-sm">
          <span class="w-2 h-2 rounded-full" style="background-color: ${mInfo.accentColor}"></span>
          <span>${mInfo.name}</span>
          <span class="font-mono text-white font-bold ml-0.5">${count}회</span>
        </span>
      `;
    }).join('');

    typeSummaryHtml = `
      <div class="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 mb-6 shadow-inner">
        <span class="text-xs font-bold text-slate-300 block mb-2 flex items-center gap-1.5">
          <i data-lucide="pie-chart" class="w-4 h-4 text-indigo-400"></i>
          테스트 유형별 진행 횟수 요약 (총 ${roundResults.length}회)
        </span>
        <div class="flex items-center gap-1.5 flex-wrap">
          ${chips}
        </div>
      </div>
    `;
  }

  let tierBadge = '';
  let tierDesc = '';
  if (avg < 200) {
    tierBadge = `<span class="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-sm">👑 신의 경지 (Top 0.1%)</span>`;
    tierDesc = '빛의 속도에 가까운 전설적인 반사신경입니다! 어떤 상황에서도 압도적인 반응속도를 보여줍니다.';
  } else if (avg < 250) {
    tierBadge = `<span class="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 text-sm">⚡ 프로게이머 티어 (Top 5%)</span>`;
    tierDesc = '상위 랭커 수준의 매우 정밀하고 번개 같은 반응속도입니다.';
  } else if (avg < 300) {
    tierBadge = `<span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-sm">🎯 훌륭한 반사신경 (상위 20%)</span>`;
    tierDesc = '일반인 평균을 훌륭하게 상회하는 높은 집중력과 반사신경입니다.';
  } else if (avg < 370) {
    tierBadge = `<span class="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30 text-sm">☕ 일반인 평균</span>`;
    tierDesc = '자연스럽고 안정적인 정상 반응속도입니다. 컨디션이 좋을 때 다시 도전해보세요!';
  } else {
    tierBadge = `<span class="px-3 py-1 rounded-full bg-slate-500/20 text-slate-300 font-bold border border-slate-500/30 text-sm">🐢 여유로운 속도</span>`;
    tierDesc = '차분하고 여유로운 속도입니다. 심호흡 후 다시 집중해서 도전해보세요!';
  }

  const roundBarsHtml = roundResults.map((ms, index) => {
    const isThisBest = ms === best;
    const isThisWorst = ms === worst && roundResults.length > 1;
    const barWidth = Math.min(100, Math.max(15, (ms / 500) * 100));

    let tagColor = 'bg-slate-700 text-slate-200';
    if (isThisBest) tagColor = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
    if (isThisWorst) tagColor = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';

    const detailItem = roundDetails[index];
    const itemModeInfo = detailItem && detailItem.mode ? TEST_MODES[detailItem.mode] : null;
    const modeBadge = (currentMode === 'random' || currentMode === 'custom-sequence') && itemModeInfo 
      ? `<span class="text-[10px] px-1.5 py-0.5 rounded font-bold ${itemModeInfo.badgeClass} flex-shrink-0">[${itemModeInfo.name}]</span>` 
      : '';

    // 홀드/압력 타이밍 추가 정보
    let extraDetailHtml = '';
    if (detailItem && detailItem.holdPressTime && detailItem.holdReleaseTime) {
      extraDetailHtml = `<span class="text-[9px] text-cyan-400 font-mono whitespace-nowrap flex-shrink-0">누르기:${detailItem.holdPressTime}ms 떼기:${detailItem.holdReleaseTime}ms</span>`;
    } else if (detailItem && detailItem.timingDiff !== undefined) {
      const dAbs = Math.abs(detailItem.timingDiff);
      const dDir = detailItem.timingDiff > 0 ? '↑늦음' : detailItem.timingDiff < 0 ? '↓빠름' : '완벽';
      extraDetailHtml = `<span class="text-[9px] text-lime-400 font-mono whitespace-nowrap flex-shrink-0">오차:±${dAbs}ms ${dDir}</span>`;
    }

    return `
      <div class="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
        <span class="w-12 font-semibold text-slate-400 flex-shrink-0">${index + 1}회차</span>
        ${modeBadge}
        <div class="flex-1 h-7 bg-slate-900 rounded-lg overflow-hidden p-1 flex items-center relative border border-slate-800">
          <div class="h-full rounded-md ${isThisBest ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-700'} transition-all duration-500" style="width: ${barWidth}%"></div>
          <span class="absolute right-3 font-mono font-bold text-slate-200">${ms} ms</span>
        </div>
        ${extraDetailHtml}
        <span class="w-14 text-right text-[11px] font-medium px-1.5 py-0.5 rounded ${tagColor} flex-shrink-0">
          ${isThisBest ? '최고 ⚡' : isThisWorst ? '최저 🐢' : '정상'}
        </span>
      </div>
    `;
  }).join('');

  resultDashboard.innerHTML = `
    <div class="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-md font-bold text-xs ${modeInfo.badgeClass}">[${modeInfo.name}]</span>
            ${tierBadge}
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">${currentSettings.totalRounds}회 모드</span>
            ${isNewPb ? `<span class="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 text-xs animate-bounce">NEW ${modeInfo.name} 최고 평균 기록! 🎉</span>` : ''}
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-white">${modeInfo.name} 결과 종합</h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">${tierDesc}</p>
        </div>
      </div>

      <!-- 4분할 통계 그리드 -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div class="p-4 rounded-2xl bg-slate-950/70 border border-blue-500/20 flex flex-col bg-gradient-to-b from-blue-500/5 to-transparent">
          <span class="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
            <i data-lucide="calculator" class="w-3.5 h-3.5 text-blue-400"></i>
            평균 반응속도
          </span>
          <div class="flex items-baseline gap-1 mt-auto">
            <span class="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">${avg}</span>
            <span class="text-xs text-slate-400 font-medium">ms</span>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20 flex flex-col bg-gradient-to-b from-emerald-500/5 to-transparent">
          <span class="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
            <i data-lucide="zap" class="w-3.5 h-3.5 text-emerald-400"></i>
            최고 반응속도
          </span>
          <div class="flex items-baseline gap-1 mt-auto">
            <span class="text-2xl sm:text-3xl font-black text-emerald-300 font-mono tracking-tight">${best}</span>
            <span class="text-xs text-emerald-400 font-medium">ms</span>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col">
          <span class="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
            <i data-lucide="trending-down" class="w-3.5 h-3.5 text-rose-400"></i>
            최저 반응속도
          </span>
          <div class="flex items-baseline gap-1 mt-auto">
            <span class="text-2xl sm:text-3xl font-black text-slate-300 font-mono tracking-tight">${worst}</span>
            <span class="text-xs text-slate-400 font-medium">ms</span>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col">
          <span class="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
            <i data-lucide="target" class="w-3.5 h-3.5 text-amber-400"></i>
            정답률 (정확도)
          </span>
          <div class="flex items-baseline gap-1 mt-auto">
            <span class="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">${accuracy}</span>
            <span class="text-xs text-slate-400 font-medium">%</span>
          </div>
          <span class="text-[10px] text-slate-500 mt-0.5">정답 ${roundSuccessCount} / 오답·조기 ${falseStarts}회</span>
        </div>
      </div>

      ${typeSummaryHtml}

      <!-- 회차별 반응속도 추이 꺾은선 차트 -->
      <div class="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800 mb-6">
        <h3 class="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
          <span class="flex items-center gap-1.5">
            <i data-lucide="line-chart" class="w-4 h-4" style="color: ${modeInfo.accentColor}"></i>
            회차별 반응속도 추이 (Line Chart)
          </span>
          <span class="text-[11px] text-slate-500 font-normal">기준 평균선: ${avg}ms</span>
        </h3>
        <div class="w-full h-52 relative">
          <canvas id="roundLineChart"></canvas>
        </div>
      </div>

      <!-- 회차별 상세 리스트 -->
      <div class="bg-slate-950/50 rounded-2xl p-4 sm:p-5 border border-slate-800/80 mb-6">
        <h3 class="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
          <span>회차별 반응속도 리스트 (1~${currentSettings.totalRounds}회)</span>
          <span class="text-[11px] text-slate-500 font-normal">빠를수록 좋습니다</span>
        </h3>
        <div class="space-y-2.5 max-h-52 overflow-y-auto pr-1">
          ${roundBarsHtml}
        </div>
      </div>

      <!-- 액션 버튼들 -->
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <button id="restartBtn" class="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
          <i data-lucide="rotate-ccw" class="w-5 h-5"></i>
          <span>${modeInfo.name} 다시 시작</span>
        </button>

        <button id="viewHistoryFromSummaryBtn" class="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2">
          <i data-lucide="bar-chart-2" class="w-4 h-4 text-teal-400"></i>
          <span>누적 기록 보기</span>
        </button>

        <button id="shareBtn" class="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2" title="결과 복사하기">
          <i data-lucide="copy" class="w-4 h-4"></i>
          <span id="shareBtnText">결과 복사</span>
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
  renderRoundLineChart(roundResults, avg);

  document.getElementById('restartBtn').addEventListener('click', () => {
    startTest();
  });
  document.getElementById('viewHistoryFromSummaryBtn').addEventListener('click', () => {
    openAnalyticsModal();
  });
  document.getElementById('shareBtn').addEventListener('click', () => {
    copyResultToClipboard(avg, best, worst, accuracy);
  });
}

function renderRoundLineChart(results, avg) {
  const ctx = document.getElementById('roundLineChart');
  if (!ctx || typeof Chart === 'undefined') return;

  if (summaryChartInstance) {
    summaryChartInstance.destroy();
  }

  const modeInfo = TEST_MODES[currentMode];
  const labels = results.map((_, i) => `${i + 1}회`);
  const avgLineData = results.map(() => avg);

  summaryChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '반응속도 (ms)',
          data: results,
          borderColor: modeInfo.accentColor,
          backgroundColor: `${modeInfo.accentColor}22`,
          borderWidth: 2.5,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: modeInfo.accentColor,
          pointBorderColor: '#0f172a',
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: '평균선 (ms)',
          data: avgLineData,
          borderColor: '#60a5fa',
          borderWidth: 1.5,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#94a3b8', font: { size: 11, family: 'Pretendard' }, boxWidth: 12 }
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#e2e8f0',
          bodyColor: '#38bdf8',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw} ms`
          }
        }
      },
      scales: {
        x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
        y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { size: 11 } } }
      }
    }
  });
}

// ==========================================
// 14. 기록 및 통계 분석 모달 (Analytics)
// ==========================================
function openAnalyticsModal() {
  analyticsModal.classList.remove('hidden');
  analyticsModal.classList.add('flex');
  renderHistoryList();
  renderCharts();
  if (window.lucide) window.lucide.createIcons();
}

function closeAnalyticsModal() {
  analyticsModal.classList.add('hidden');
  analyticsModal.classList.remove('flex');
}

function renderHistoryList() {
  const filteredList = historyFilter === 'all' 
    ? testHistory 
    : testHistory.filter(item => (item.testType || 'green-light') === historyFilter);

  historyCountText.textContent = `총 ${filteredList.length}개의 세션 기록 (${historyFilter === 'all' ? '전체' : TEST_MODES[historyFilter]?.name})`;

  if (filteredList.length === 0) {
    historyListContainer.innerHTML = `
      <div class="py-12 text-center text-slate-500 text-xs">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
        저장된 테스트 기록이 없습니다. 테스트를 완료해보세요!
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  historyListContainer.innerHTML = filteredList.map(item => {
    const typeKey = item.testType || 'green-light';
    const modeInfo = TEST_MODES[typeKey] || TEST_MODES['green-light'];


    return `
      <div class="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all">
        <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span class="px-2 py-0.5 rounded-md font-bold text-[10px] ${modeInfo.badgeClass}">
              ${modeInfo.name}
            </span>
            <span class="font-mono text-slate-300 font-semibold text-[11px] sm:text-xs">${item.date}</span>
            <span class="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">${item.totalRounds}회</span>
          </div>
          <button class="delete-history-btn text-slate-500 hover:text-rose-400 transition-colors p-1" data-id="${item.id}" title="이 기록 삭제">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <div class="grid grid-cols-4 gap-2 text-center text-xs">
          <div class="bg-slate-900/80 rounded-xl p-2 border border-slate-800/80">
            <span class="text-[10px] text-slate-400 block">평균</span>
            <span class="text-white font-mono font-bold text-sm">${item.avgTime}</span> <span class="text-[10px] text-slate-500">ms</span>
          </div>
          <div class="bg-slate-900/80 rounded-xl p-2 border border-slate-800/80">
            <span class="text-[10px] text-emerald-400 block">최고</span>
            <span class="text-emerald-300 font-mono font-bold text-sm">${item.bestTime}</span> <span class="text-[10px] text-slate-500">ms</span>
          </div>
          <div class="bg-slate-900/80 rounded-xl p-2 border border-slate-800/80">
            <span class="text-[10px] text-rose-400 block">최저</span>
            <span class="text-rose-300 font-mono font-bold text-sm">${item.worstTime}</span> <span class="text-[10px] text-slate-500">ms</span>
          </div>
          <div class="bg-slate-900/80 rounded-xl p-2 border border-slate-800/80">
            <span class="text-[10px] text-amber-400 block">정답률</span>
            <span class="text-amber-300 font-mono font-bold text-sm">${item.accuracy || 100}%</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();

  document.querySelectorAll('.delete-history-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id, 10);
      deleteHistoryItem(id);
    });
  });
}

function deleteHistoryItem(id) {
  testHistory = testHistory.filter(item => item.id !== id);
  try {
    localStorage.setItem('reaction_history', JSON.stringify(testHistory));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }

  Object.keys(TEST_MODES).forEach(m => {
    const mSessions = testHistory.filter(i => (i.testType || 'green-light') === m);
    if (mSessions.length > 0) {
      const best = Math.min(...mSessions.map(i => i.avgTime));
      try { localStorage.setItem(`reaction_best_session_avg_${m}`, best.toString()); } catch (e) {}
    } else {
      try { localStorage.removeItem(`reaction_best_session_avg_${m}`); } catch (e) {}
    }
  });

  updatePBDisplay();
  renderHistoryList();
  renderCharts();
}

function renderCharts() {
  if (typeof Chart === 'undefined') return;

  const calcAvg = (arr) => arr.length ? Math.round(arr.reduce((acc, c) => acc + c.avgTime, 0) / arr.length) : null;

  const sortedSessions = [...testHistory].reverse().slice(-15);
  const trendCtx = document.getElementById('historyTrendChart');
  if (trendCtx) {
    if (historyTrendChartInstance) historyTrendChartInstance.destroy();

    historyTrendChartInstance = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: sortedSessions.map((s, idx) => `${idx + 1}회차`),
        datasets: [{
          label: '세션 평균 (ms)',
          data: sortedSessions.map(s => s.avgTime),
          borderColor: '#14b8a6',
          backgroundColor: 'rgba(20, 184, 166, 0.15)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#2dd4bf',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            callbacks: {
              title: (items) => {
                const s = sortedSessions[items[0].dataIndex];
                const m = TEST_MODES[s?.testType || 'green-light']?.name || '초록불';
                return s ? `${s.date} [${m}]` : '';
              }
            }
          }
        },
        scales: {
          x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }


  const modeCtx = document.getElementById('modeCompareChart');
  if (modeCtx) {
    if (modeCompareChartInstance) modeCompareChartInstance.destroy();

    const modeLabels = Object.values(TEST_MODES).map(m => m.name);
    const modeColors = Object.values(TEST_MODES).map(m => m.accentColor);
    const modeAverages = Object.keys(TEST_MODES).map(mId => {
      const mSessions = testHistory.filter(i => (i.testType || 'green-light') === mId);
      return calcAvg(mSessions) || 0;
    });

    modeCompareChartInstance = new Chart(modeCtx, {
      type: 'bar',
      data: {
        labels: modeLabels,
        datasets: [{
          data: modeAverages,
          backgroundColor: modeColors.map(c => `${c}aa`),
          borderColor: modeColors,
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }
}

// ==========================================
// 15. 모달 제어 및 유틸
// ==========================================
function openSettingsModal() {
  settingsModal.classList.remove('hidden');
  settingsModal.classList.add('flex');
}
function closeSettingsModal() {
  settingsModal.classList.add('hidden');
  settingsModal.classList.remove('flex');
}

function openResetConfirmModal() {
  resetConfirmModal.classList.remove('hidden');
  resetConfirmModal.classList.add('flex');
}
function closeResetConfirmModal() {
  resetConfirmModal.classList.add('hidden');
  resetConfirmModal.classList.remove('flex');
}

function openQuitConfirmModal() {
  if (quitModalDesc) {
    quitModalDesc.textContent = `현재 진행 중인 [${TEST_MODES[currentMode].name}] (라운드 ${currentRound} / ${currentSettings.totalRounds}) 측정 데이터가 취소되고 기본 홈 화면으로 초기화됩니다. 환경 설정은 유지됩니다.`;
  }
  quitConfirmModal.classList.remove('hidden');
  quitConfirmModal.classList.add('flex');
  if (window.lucide) window.lucide.createIcons();
}
function closeQuitConfirmModal() {
  quitConfirmModal.classList.add('hidden');
  quitConfirmModal.classList.remove('flex');
}

function openHelpModal() {
  helpModal.classList.remove('hidden');
  helpModal.classList.add('flex');
}
function closeHelpModal() {
  helpModal.classList.add('hidden');
  helpModal.classList.remove('flex');
}

function copyResultToClipboard(avg, best, worst, accuracy) {
  const modeInfo = TEST_MODES[currentMode];
  const shareText = `⚡ [반응 테스트 - ${modeInfo.name}] ⚡\n모드: ${currentSettings.totalRounds}회\n평균: ${avg}ms | 최고: ${best}ms | 최저: ${worst}ms\n정답률: ${accuracy}%\n\n나의 반응속도를 측정해보세요!`;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareText).then(() => {
      showCopyFeedback();
    }).catch(() => fallbackCopy(shareText));
  } else {
    fallbackCopy(shareText);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showCopyFeedback();
  } catch (err) {
    alert('결과를 복사하지 못했습니다.');
  }
  document.body.removeChild(textArea);
}

function showCopyFeedback() {
  const shareBtnText = document.getElementById('shareBtnText');
  if (shareBtnText) {
    const original = shareBtnText.textContent;
    shareBtnText.textContent = '복사 완료! ✔';
    setTimeout(() => {
      shareBtnText.textContent = original;
    }, 2000);
  }
}

function formatCurrentDateTime() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${y}.${m}.${d} ${hh}:${mm}`;
}

// ==========================================
// 16. 전체 이벤트 리스너 바인딩
// ==========================================

// 상위 플레이 모드 카테고리 탭 (개별 테스트 / 랜덤 모드 / 지정 모드) 이벤트 바인딩
document.querySelectorAll('.category-tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const cat = btn.dataset.category;
    if (cat) setPlayCategory(cat);
  });
});

// 메인 클릭 영역 인터랙션
testArea.addEventListener('pointerdown', (e) => {
  if (!helpModal.classList.contains('hidden') || 
      !settingsModal.classList.contains('hidden') || 
      !analyticsModal.classList.contains('hidden') || 
      !resetConfirmModal.classList.contains('hidden') ||
      !quitConfirmModal.classList.contains('hidden')) {
    return;
  }

  const clickedBtn = e.target.closest('button');
  if (clickedBtn) {
    if (clickedBtn.id === 'startTestBtn') {
      e.preventDefault();
      handleInteraction();
      return;
    }
    if (clickedBtn.id === 'nextStepBtn') {
      e.preventDefault();
      proceedFromRoundResult();
      return;
    }
    if (clickedBtn.id === 'retryRoundBtn') {
      e.preventDefault();
      startRound();
      return;
    }
    return;
  }

  // IDLE 또는 PAUSED 상태일 때는 배경 클릭 방지
  if (currentState === STATES.IDLE || currentState === STATES.PAUSED) {
    return;
  }

  // 회차 전환 화면(ROUND_RESULT) 상태: 화면 어디를 클릭하든 다음 단계 진행
  if (currentState === STATES.ROUND_RESULT) {
    e.preventDefault();
    proceedFromRoundResult();
    return;
  }

  // 조기 반응 화면(EARLY_CLICK) 상태: 화면 어디를 클릭하든 현재 라운드 재시도
  if (currentState === STATES.EARLY_CLICK) {
    e.preventDefault();
    startRound();
    return;
  }

  // 오답/시간초과(MISSED) 화면 상태
  if (currentState === STATES.MISSED) {
    e.preventDefault();
    handleInteraction();
    return;
  }

  // 위치 조준 모드일 때
  if (activeRoundMode === 'position') {
    if (currentState === STATES.WAITING) {
      e.preventDefault();
      handleEarlyClick();
      return;
    }
    if (currentState === STATES.READY_TO_CLICK) {
      e.preventDefault();
      handleModeAnswer(false);
      return;
    }
  }

  // 소리 반응 모드일 때 대기 중 또는 소리 출력 전 클릭 시 조기 클릭
  if (activeRoundMode === 'audio') {
    if (currentState === STATES.WAITING || (currentState === STATES.READY_TO_CLICK && !isAudioTargetPlaying)) {
      e.preventDefault();
      handleEarlyClick();
      return;
    }
  }

  // 홀드 반응 모드일 때 마우스 다운 핸들링
  if (activeRoundMode === 'hold-release') {
    if (currentState === STATES.WAITING) {
      e.preventDefault();
      handleEarlyClick();
      return;
    }
    if (currentState === STATES.READY_TO_CLICK) {
      e.preventDefault();
      handleHoldPress();
      return;
    }
  }

  // 동시 자극 모드: 대기 중이거나 동시 점등 이전 클릭 시 조기 클릭
  if (activeRoundMode === 'dual-stimuli') {
    if (currentState === STATES.WAITING || (currentState === STATES.READY_TO_CLICK && !dualIsSimultaneous)) {
      e.preventDefault();
      handleEarlyClick();
      return;
    }
  }

  // 신호 종료 모드: 대기 중이거나 불빛이 완전히 꺼지기 전 클릭 시 조기 클릭
  if (activeRoundMode === 'signal-offset') {
    if (currentState === STATES.WAITING || (currentState === STATES.READY_TO_CLICK && !signalOffsetExtinguished)) {
      e.preventDefault();
      handleEarlyClick();
      return;
    }
  }

  // 압력 타이밍 모드: 대기 중 클릭 시 조기 클릭
  if (activeRoundMode === 'expansion-timing' && currentState === STATES.WAITING) {
    e.preventDefault();
    handleEarlyClick();
    return;
  }

  // 숫자 출현 모드: 대기 중 클릭 시 조기 클릭
  if (activeRoundMode === 'rapid-number' && currentState === STATES.WAITING) {
    e.preventDefault();
    handleEarlyClick();
    return;
  }

  // 선택형 모드(색상, 방향, 순서 반전, 도형)에서 READY_TO_CLICK 상태일 때 버튼 외 배경 클릭 시 무시
  if ((activeRoundMode === 'color-match' || activeRoundMode === 'direction' || activeRoundMode === 'inverted-direction' || activeRoundMode === 'shape') && currentState === STATES.READY_TO_CLICK) {
    return;
  }

  e.preventDefault();
  handleInteraction();
});

// 마우스/터치 업 핸들러 (홀드 반응 떼기 감지)
testArea.addEventListener('pointerup', (e) => {
  if (activeRoundMode === 'hold-release' && currentState === STATES.READY_TO_CLICK) {
    e.preventDefault();
    handleHoldRelease();
  }
});

// 키보드 입력 핸들러
window.addEventListener('keydown', (e) => {
  // 모달 닫기
  if (e.code === 'Escape') {
    if (!quitConfirmModal.classList.contains('hidden')) {
      closeQuitConfirmModal();
      return;
    }
    if (!resetConfirmModal.classList.contains('hidden')) {
      closeResetConfirmModal();
      return;
    }
    if (!settingsModal.classList.contains('hidden')) {
      closeSettingsModal();
      return;
    }
    if (!analyticsModal.classList.contains('hidden')) {
      closeAnalyticsModal();
      return;
    }
    if (!helpModal.classList.contains('hidden')) {
      closeHelpModal();
      return;
    }
    if (currentState === STATES.PAUSED) {
      resumeTest();
    } else if (currentState !== STATES.IDLE && currentState !== STATES.SUMMARY) {
      pauseTest();
    }
    return;
  }

  // 일시정지 단축키 (P)
  if (e.code === 'KeyP') {
    if (currentState === STATES.PAUSED) {
      resumeTest();
    } else if (currentState !== STATES.IDLE && currentState !== STATES.SUMMARY) {
      pauseTest();
    }
    return;
  }

  // 방향 반응 테스트 (Direction) 키보드 방향키 핸들링
  if (activeRoundMode === 'direction') {
    let pressedDir = null;
    const key = e.key;
    const code = e.code;
    if (key === 'ArrowUp' || code === 'ArrowUp' || key === 'w' || key === 'W' || code === 'KeyW') pressedDir = 'up';
    else if (key === 'ArrowDown' || code === 'ArrowDown' || key === 's' || key === 'S' || code === 'KeyS') pressedDir = 'down';
    else if (key === 'ArrowLeft' || code === 'ArrowLeft' || key === 'a' || key === 'A' || code === 'KeyA') pressedDir = 'left';
    else if (key === 'ArrowRight' || code === 'ArrowRight' || key === 'd' || key === 'D' || code === 'KeyD') pressedDir = 'right';

    if (pressedDir) {
      e.preventDefault();
      if (currentState === STATES.WAITING) {
        // 목표가 나오기 전 방향키 입력 시 조기 입력 처리!
        handleEarlyClick();
        return;
      }
      if (currentState === STATES.READY_TO_CLICK && modeQuestionData && modeQuestionData.targetDirection) {
        handleModeAnswer(pressedDir === modeQuestionData.targetDirection.id);
        return;
      }
    }
  }

  // 순서 반전 테스트 (Inverted Direction) 키보드 방향키 핸들링
  if (activeRoundMode === 'inverted-direction') {
    let pressedDir = null;
    const key = e.key;
    const code = e.code;
    if (key === 'ArrowUp' || code === 'ArrowUp' || key === 'w' || key === 'W' || code === 'KeyW') pressedDir = 'up';
    else if (key === 'ArrowDown' || code === 'ArrowDown' || key === 's' || key === 'S' || code === 'KeyS') pressedDir = 'down';
    else if (key === 'ArrowLeft' || code === 'ArrowLeft' || key === 'a' || key === 'A' || code === 'KeyA') pressedDir = 'left';
    else if (key === 'ArrowRight' || code === 'ArrowRight' || key === 'd' || key === 'D' || code === 'KeyD') pressedDir = 'right';

    if (pressedDir) {
      e.preventDefault();
      if (currentState === STATES.WAITING) {
        handleEarlyClick();
        return;
      }
      if (currentState === STATES.READY_TO_CLICK && modeQuestionData && modeQuestionData.targetDirection) {
        // 반대 방향 ID와 비교 (청개구리: 반대 방향 입력이 정답)
        handleModeAnswer(pressedDir === modeQuestionData.targetDirection.oppositeId);
        return;
      }
    }
  }

  // Spacebar / Enter 단축키
  if (e.code === 'Space' || e.code === 'Enter') {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) {
      return;
    }
    e.preventDefault();
    if (e.repeat) return;

    if (!quitConfirmModal.classList.contains('hidden')) {
      closeQuitConfirmModal();
      return;
    }
    if (!resetConfirmModal.classList.contains('hidden')) {
      closeResetConfirmModal();
      return;
    }
    if (!settingsModal.classList.contains('hidden')) {
      closeSettingsModal();
      return;
    }
    if (!analyticsModal.classList.contains('hidden')) {
      closeAnalyticsModal();
      return;
    }
    if (!helpModal.classList.contains('hidden')) {
      closeHelpModal();
      return;
    }

    if (currentState === STATES.PAUSED) {
      resumeTest();
      return;
    }

    // 1. 결과 전환 화면(ROUND_RESULT) 상태: 다음 단계 진행
    if (currentState === STATES.ROUND_RESULT) {
      proceedFromRoundResult();
      return;
    }

    // 2. 조기 반응 화면(EARLY_CLICK) 상태: 현재 라운드 재시도
    if (currentState === STATES.EARLY_CLICK) {
      startRound();
      return;
    }

    // 3. 오답/시간초과(MISSED) 화면 상태
    if (currentState === STATES.MISSED) {
      handleInteraction();
      return;
    }

    if (currentState === STATES.SUMMARY) {
      startTest();
      return;
    }

    // 4. 테스트 진행 중(WAITING / READY_TO_CLICK) 조기 반응 처리
    // 소리 모드
    if (activeRoundMode === 'audio' && (currentState === STATES.WAITING || (currentState === STATES.READY_TO_CLICK && !isAudioTargetPlaying))) {
      handleEarlyClick();
      return;
    }

    // 홀드 반응 모드
    if (activeRoundMode === 'hold-release') {
      if (currentState === STATES.WAITING) {
        handleEarlyClick();
        return;
      }
      if (currentState === STATES.READY_TO_CLICK) {
        handleHoldPress();
        return;
      }
      return;
    }

    // 동시 자극 모드 Spacebar: 대기 중이거나 동시 점등 이전 누르면 조기 클릭
    if (activeRoundMode === 'dual-stimuli') {
      if (currentState === STATES.WAITING || (currentState === STATES.READY_TO_CLICK && !dualIsSimultaneous)) {
        handleEarlyClick();
        return;
      }
    }

    // 신호 종료 모드 Spacebar: 대기 중이거나 불빛 소등 전 누르면 조기 클릭
    if (activeRoundMode === 'signal-offset') {
      if (currentState === STATES.WAITING || (currentState === STATES.READY_TO_CLICK && !signalOffsetExtinguished)) {
        handleEarlyClick();
        return;
      }
    }

    // 압력 타이밍 모드 Spacebar: 대기 중이면 조기 클릭, READY_TO_CLICK이면 handleInteraction 처리
    if (activeRoundMode === 'expansion-timing') {
      if (currentState === STATES.WAITING) {
        handleEarlyClick();
        return;
      }
      // READY_TO_CLICK은 아래 handleInteraction()으로 흐름
    }

    // 숫자 출현 모드 Spacebar: 대기 중이면 조기 클릭, READY_TO_CLICK이면 handleInteraction 처리
    if (activeRoundMode === 'rapid-number') {
      if (currentState === STATES.WAITING) {
        handleEarlyClick();
        return;
      }
      // READY_TO_CLICK은 아래 handleInteraction()으로 흐름
    }

    // 선택형 모드(색상, 방향, 순서 반전, 위치, 도형)의 READY_TO_CLICK에서는 Spacebar 클릭 금지
    if ((activeRoundMode === 'color-match' || activeRoundMode === 'direction' || activeRoundMode === 'inverted-direction' || activeRoundMode === 'position' || activeRoundMode === 'shape') && currentState === STATES.READY_TO_CLICK) {
      return;
    }

    handleInteraction();
  }
});

// 키업 핸들러 - 홀드 반응 모드 Spacebar 떼기 감지
window.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    if (activeRoundMode === 'hold-release' && currentState === STATES.READY_TO_CLICK) {
      e.preventDefault();
      handleHoldRelease();
    }
  }
});

// 모드 선택 탭 버튼 이벤트
document.querySelectorAll('.mode-tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const mode = btn.dataset.mode;
    if (mode) setTestMode(mode);
  });
});

// 히스토리 모달 내 모드 필터 버튼 이벤트
document.querySelectorAll('.history-filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.history-filter-btn').forEach(b => {
      b.classList.remove('active', 'bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/30');
      b.classList.add('bg-slate-800', 'text-slate-400', 'border-slate-700');
    });
    btn.classList.add('active', 'bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/30');
    btn.classList.remove('bg-slate-800', 'text-slate-400', 'border-slate-700');

    historyFilter = btn.dataset.filter || 'all';
    renderHistoryList();
  });
});

// 일시정지 버튼
pauseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  pauseTest();
});

// 사운드 토글
soundToggleBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleSound();
});

// 설정 모달 제어
settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  openSettingsModal();
});
closeSettingsBtn.addEventListener('click', closeSettingsModal);

roundOptionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    roundOptionBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

minWaitInput.addEventListener('input', () => {
  let min = parseFloat(minWaitInput.value);
  let max = parseFloat(maxWaitInput.value);
  if (min >= max) {
    max = min + 0.5;
    maxWaitInput.value = max;
    maxWaitVal.textContent = max.toFixed(1);
  }
  minWaitVal.textContent = min.toFixed(1);
  waitRangeLabel.textContent = `${min.toFixed(1)}초 ~ ${max.toFixed(1)}초`;
});

maxWaitInput.addEventListener('input', () => {
  let min = parseFloat(minWaitInput.value);
  let max = parseFloat(maxWaitInput.value);
  if (max <= min) {
    min = Math.max(0.5, max - 0.5);
    minWaitInput.value = min;
    minWaitVal.textContent = min.toFixed(1);
  }
  maxWaitVal.textContent = max.toFixed(1);
  waitRangeLabel.textContent = `${min.toFixed(1)}초 ~ ${max.toFixed(1)}초`;
});

saveSettingsBtn.addEventListener('click', () => {
  const activeRoundBtn = document.querySelector('.round-option-btn.active');
  const selectedRounds = activeRoundBtn ? parseInt(activeRoundBtn.dataset.rounds, 10) : currentSettings.totalRounds;
  currentSettings = {
    totalRounds: selectedRounds,
    minWaitSec: parseFloat(minWaitInput.value),
    maxWaitSec: parseFloat(maxWaitInput.value)
  };

  ensureCustomSequenceLength(currentSettings.totalRounds);
  saveSettings();
  closeSettingsModal();
  // IDLE 상태이면 강제로 현재 화면 갱신
  if (currentState === STATES.IDLE) {
    renderState(STATES.IDLE);
  }
  showToast('설정이 성공적으로 적용되었습니다.');
});

// 통계 모달 제어
analyticsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  openAnalyticsModal();
});
closeAnalyticsBtn.addEventListener('click', closeAnalyticsModal);
closeAnalyticsBottomBtn.addEventListener('click', closeAnalyticsModal);

tabHistoryBtn.addEventListener('click', () => {
  tabHistoryBtn.classList.add('border-emerald-400', 'text-emerald-400');
  tabHistoryBtn.classList.remove('border-transparent', 'text-slate-400');
  tabChartsBtn.classList.remove('border-emerald-400', 'text-emerald-400');
  tabChartsBtn.classList.add('border-transparent', 'text-slate-400');
  tabContentHistory.classList.remove('hidden');
  tabContentCharts.classList.add('hidden');
});

tabChartsBtn.addEventListener('click', () => {
  tabChartsBtn.classList.add('border-emerald-400', 'text-emerald-400');
  tabChartsBtn.classList.remove('border-transparent', 'text-slate-400');
  tabHistoryBtn.classList.remove('border-emerald-400', 'text-emerald-400');
  tabHistoryBtn.classList.add('border-transparent', 'text-slate-400');
  tabContentCharts.classList.remove('hidden');
  tabContentHistory.classList.add('hidden');
  renderCharts();
});

// 초기화 모달 리스너
clearAllHistoryBtn.addEventListener('click', openResetConfirmModal);
openResetFromFooterBtn.addEventListener('click', openResetConfirmModal);
cancelResetBtn.addEventListener('click', closeResetConfirmModal);
confirmResetBtn.addEventListener('click', () => {
  clearAllData();
  closeResetConfirmModal();
});

// 테스트 중단 및 처음으로 리스너
cancelQuitBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeQuitConfirmModal();
});
confirmQuitBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeQuitConfirmModal();
  resetToHome();
});

// 가이드 모달
helpBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  openHelpModal();
});
closeHelpBtn.addEventListener('click', closeHelpModal);
confirmHelpBtn.addEventListener('click', closeHelpModal);

// 모달 바깥 배경 클릭 닫기
[settingsModal, analyticsModal, resetConfirmModal, quitConfirmModal, helpModal].forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });
});

// 초기화 실행
window.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  renderState(STATES.IDLE);
  if (window.lucide) window.lucide.createIcons();
});
