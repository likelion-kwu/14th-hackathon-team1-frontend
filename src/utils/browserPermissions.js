export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  if (window.Notification.permission !== 'default') {
    return window.Notification.permission;
  }

  return window.Notification.requestPermission();
};

export const requestMicrophonePermission = async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    return true;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    //console.error('마이크 권한 요청 실패:', error);
    return false;
  }
};
