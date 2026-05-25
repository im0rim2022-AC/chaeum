// Chaeum Korean Language Academy - Core JavaScript Logic

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeaderScroll();
  initMobileMenu();
  initClinicInteraction();
});

// 1. Header scroll visual transformation
function initHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 2. Mobile navigation drawer toggle
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// 3. Scroll Animate via Intersection Observer
function initScrollAnimations() {
  const elements = document.querySelectorAll('.scroll-animate');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    elements.forEach(el => el.classList.add('animated'));
  }
}

// 4. Curriculum Tab Switching Logic
function switchCurriculum(type) {
  const middlePane = document.getElementById('middleCurriculum');
  const highPane = document.getElementById('highCurriculum');
  const buttons = document.querySelectorAll('.curriculum-tabs-nav .tab-btn');

  // Toggle active tab buttons
  buttons.forEach(btn => {
    if ((type === 'middle' && btn.innerText.includes('중등부')) || 
        (type === 'high' && btn.innerText.includes('고등부'))) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Toggle panes
  if (type === 'middle') {
    highPane.classList.remove('active');
    setTimeout(() => {
      highPane.style.display = 'none';
      middlePane.style.display = 'grid';
      setTimeout(() => middlePane.classList.add('active'), 50);
    }, 300);
  } else {
    middlePane.classList.remove('active');
    setTimeout(() => {
      middlePane.style.display = 'none';
      highPane.style.display = 'grid';
      setTimeout(() => highPane.classList.add('active'), 50);
    }, 300);
  }
}

// 5. Interactive Clinic Step Activation
let currentClinicStepIndex = 0;
let clinicInterval;

function initClinicInteraction() {
  const steps = document.querySelectorAll('.clinic-step');
  
  // Hover or click stops auto-rotation
  steps.forEach((step, idx) => {
    step.addEventListener('mouseenter', () => {
      stopClinicAutoPlay();
      activateClinicStep(idx);
    });
  });

  startClinicAutoPlay();
}

function activateClinicStep(index) {
  currentClinicStepIndex = index;
  const steps = document.querySelectorAll('.clinic-step');
  
  steps.forEach((step, idx) => {
    if (idx === index) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
}

function startClinicAutoPlay() {
  clinicInterval = setInterval(() => {
    currentClinicStepIndex = (currentClinicStepIndex + 1) % 4;
    activateClinicStep(currentClinicStepIndex);
  }, 4000);
}

function stopClinicAutoPlay() {
  if (clinicInterval) {
    clearInterval(clinicInterval);
  }
}

// 6. Modal Windows Management
function openConsultationModal() {
  document.getElementById('consultationModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeConsultationModal() {
  document.getElementById('consultationModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

function openQuizModal() {
  resetQuiz();
  document.getElementById('quizModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuizModal() {
  document.getElementById('quizModal').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// 7. 3-Minute Diagnostic Level Test Simulator Logic
let quizAnswers = [null, null, null]; // Stores user choices
const correctAnswers = [0, 2, 2]; // Q1: 0 (웬만해서는), Q2: 2 (문해력강조), Q3: 2 (이별의단절)

function selectAnswer(questionIdx, optionIdx) {
  quizAnswers[questionIdx] = optionIdx;
  
  // Add styling to selected button
  const questionWrap = document.querySelectorAll('.quiz-question-wrap')[questionIdx];
  const optionButtons = questionWrap.querySelectorAll('.option-btn');
  
  optionButtons.forEach((btn, idx) => {
    if (idx === optionIdx) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });

  // Short delay for user to see selection, then auto advance or show result
  setTimeout(() => {
    if (questionIdx < 2) {
      // Advance to next question
      questionWrap.classList.remove('active');
      const nextQuestion = document.querySelectorAll('.quiz-question-wrap')[questionIdx + 1];
      nextQuestion.classList.add('active');
      
      // Update progress bar
      const progressPercent = ((questionIdx + 1) / 3) * 100;
      document.getElementById('quizProgress').style.width = `${progressPercent}%`;
    } else {
      // Calculate and display score
      showQuizResults();
    }
  }, 400);
}

function showQuizResults() {
  let score = 0;
  quizAnswers.forEach((ans, idx) => {
    if (ans === correctAnswers[idx]) {
      score += 1;
    }
  });

  const percentScore = Math.round((score / 3) * 100);
  let level = '';
  let analysis = '';
  let recommendedFocus = '종합';

  if (percentScore === 100) {
    level = '내신·수능 1등급 최상위권 잠재력';
    analysis = '축하합니다! 문해력과 올바른 한글 문법 체계, 고전 시가의 상징적 성격을 완벽하게 분석하고 파악하고 있습니다. 현재의 우수성을 굳히고 고난도 오답 지문을 극복하는 최상위권 실전 심화반 코스를 강력 추천합니다.';
    recommendedFocus = '종합';
  } else if (percentScore >= 66) {
    level = '내신·수능 2~3등급 안정권';
    analysis = '지문 분석력과 문해력이 우수하나, 한두 개의 헷갈리기 쉬운 개념과 매력적인 오답 선지 함정에서 아쉽게 오차가 발생할 우려가 있습니다. 약점을 찾아 메우는 원장 1:1 보완 대면 클리닉을 권장합니다.';
    recommendedFocus = '비문학';
  } else if (percentScore >= 33) {
    level = '기초 개념 보충 필요 단계 (3~4등급)';
    analysis = '국어 문법의 기본 맞춤법 또는 지문 핵심 취지 추출 과정에서 흔들림이 있습니다. 빈출 국어 핵심 개념어 완성과 비문학 1:1 구조 분석 훈련을 통한 빠른 실력 복구가 시급히 필요합니다.';
    recommendedFocus = '문법';
  } else {
    level = '체계적 국어 습관 입문 단계 (5등급 이하)';
    analysis = '어휘 및 문학 개념, 비문학 독해 문해력 전반에 걸친 기초 공사가 급선무입니다. 대리강사 없는 원장 직강의 완전 기초반 수업과 매일 직접 graded 어휘 지도로 기초부터 탄탄히 성적을 채워야 합니다.';
    recommendedFocus = '내신';
  }

  // Render Result DOM
  document.getElementById('quizProgress').style.width = '100%';
  document.getElementById('quizContent').style.display = 'none';
  
  document.getElementById('quizScoreDisplay').innerText = `${percentScore}점`;
  document.getElementById('quizLevelDisplay').innerText = level;
  document.getElementById('quizAnalysisText').innerText = analysis;
  
  // Set recommended path to global state to auto-fill the consultation form
  window.lastQuizScore = percentScore;
  window.lastQuizLevel = level;
  window.lastQuizRecommend = recommendedFocus;

  document.getElementById('quizResult').style.display = 'block';
}

function proceedToConsultationFromQuiz() {
  closeQuizModal();
  openConsultationModal();
  
  // Populate score field
  const scoreGroup = document.getElementById('quizScoreGroup');
  const scoreField = document.getElementById('quizScoreField');
  const focusSelect = document.getElementById('focusArea');
  
  scoreGroup.style.display = 'block';
  scoreField.value = `기본기 진단 테스트 결과: ${window.lastQuizScore}점 (${window.lastQuizLevel})`;
  
  // Prefill recommended focus area
  if (window.lastQuizRecommend) {
    focusSelect.value = window.lastQuizRecommend;
  }
}

function resetQuiz() {
  quizAnswers = [null, null, null];
  
  // Reset all option buttons styling
  document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
  
  // Reset visibility
  document.getElementById('quizProgress').style.width = '0%';
  document.getElementById('quizContent').style.display = 'block';
  document.getElementById('quizResult').style.display = 'none';
  
  const questionWraps = document.querySelectorAll('.quiz-question-wrap');
  questionWraps.forEach((wrap, idx) => {
    if (idx === 0) {
      wrap.classList.add('active');
    } else {
      wrap.classList.remove('active');
    }
  });
}

// 8. Form Submission & Toast System
function submitConsultation(event) {
  event.preventDefault();
  
  const form = document.getElementById('consultationForm');
  const actionUrl = form.action;
  
  if (!actionUrl || actionUrl.includes('여기에_구글웹앱_URL을_입력하세요') || actionUrl === window.location.href) {
    alert("구글 웹 앱 URL이 설정되지 않았습니다. index.html 파일에서 form의 action 속성에 URL을 먼저 입력해주세요.");
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerText;
  submitBtn.innerText = '전송 중...';
  submitBtn.disabled = true;

  const formData = new FormData(form);

  fetch(actionUrl, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    const studentName = document.getElementById('studentName').value;
    const studentGrade = document.getElementById('studentGrade').value;
    const parentPhone = document.getElementById('parentPhone').value;
    
    closeConsultationModal();
    showToast(`✨ ${studentName} 학생(${studentGrade}) 상담서가 성공적으로 전송되었습니다! 김진아 원장이 24시간 이내 연락처(${parentPhone})로 전화드립니다.`);
    
    form.reset();
    document.getElementById('quizScoreGroup').style.display = 'none';
  })
  .catch(error => {
    console.error('Error!', error.message);
    showToast(`❌ 전송 중 오류가 발생했습니다. 다시 시도해주세요.`);
  })
  .finally(() => {
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
  });
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✔️</span> <span>${message}</span>`;
  
  container.appendChild(toast);
  
  // Auto remove toast after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeIn 0.3s ease reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}
