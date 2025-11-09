export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title: string, body: string): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/tomato.svg',
      badge: '/tomato.svg',
    });
  }
};

export const playSound = (): void => {
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVKzn77BdGAg+mNvyyHMkBSh+zPHaizsIGGS57OihUBELTqXh8bllHAU3kdfx0HwpBSJyx+/glkILElys5vKuWRYLRZ7f8L5sHwU0iNDzzYU1Bhxqvu7mnEoODlKq5fCzYRoIM5PY8sp2JgUme8rx3Ik7CBhltuzpoVERC0yl4fG5ZRwFN5HX8dB8KQUicsfv4JZCCxJcrObyrVkWC0We3/C+bB8FNIjQ88yFNQYcab7u5pxKDg5SquXws2EaCDOT2PLKdiYFJnvK8dyJOwgYZbbs6aFREQtMpeHxuWUcBTeR1/HQfCkFInLH7+CWQgsRXKzm8q1ZFgtFnt/wvmwfBTSI0PPMhTUGHGm+7uacSg4OUqrl8LNhGggzk9jyynYmBSZ7yvHciTsIGGW27OmhURELTKXh8bllHAU3kdfx0HwpBSJyx+/glkILEVys5vKtWRYLRZ7f8L5sHwU0iNDzzIU1BhxqvezmXEoODlKq5fCzYRoIM5PY8sp2JgUme8rx3Ik7CBhltuzpoVERC0yl4fG5ZRwFN5HX8dB8KQUicsfv4JZCCxFcrObyrVkWC0We3/C+bB8FNIjQ88yFNQYcab7u5pxKDg5SquXws2EaCDOT2PLKdiYFJnvK8dyJOwgYZbbs6aFREQtMpeHxuWUcBTeR1/HQfCkFInLH7+CWQgsRXKzm8q1ZFgtFnt/wvmwfBTSI0PPMhTUGHGm+7uacSg4OUqrl8LNhGggzk9jyynYmBSZ7yvHciTsIGGW27OmhURELTKXh8bllHAU3kdfx0HwpBSJyx+/glkILEVys5vKtWRYLRZ7f8L5sHwU0iNDzzIU1BhxpvuzmnEoODlKq5fCzYRoIM5PY8sp2JgUme8rx3Ik7CBhltuzpoVERC0yl4fG5ZRwFN5HX8dB8KQUicsfv4JZCCxFcrObyrVkWC0We3/C+bB8FNIjQ88yFNQYcab7u5lxKDg5SquXws2EaCDOT2PLKdiYFJnvK8dyJOwgYZbbs6aFREQtMpeHxuWUcBTeR1/HQfCkFInLH7+CWQgsTXKzm8q1ZFgtFnt/wvmwfBTSI0PPMhTUGHGm+7uZcSg4OUqrl8LNhGggzk9jyynYmBSZ7yvHciTsIGGW27OmhURELTKXh8bllHAU3kdfx0HwpBSJyx+/glkILE1ys5vKtWRYLRZ7f8L5sHwU0iNDzzIU1BhxqvezmXEoODlKq5fCzYRoIM5PY8sp2JgUme8rx3Ik7CBhltuzpoVERC0yl4fG5ZRwFN5HX8dB8KQUicsfv4JZCCxNcrObyrVkWC0We3/C+bB8FNIjQ88yFNQYcab7u5lxKDg5SquXws2EaCDOT2PLKdiYFJnvK8dyJOwgYZbbs6aFREQtMpeHxuWUcBTeR1/HQfCkFInLH7+CWQgsTXKzm8q1ZFgtFnt/wvmwfBTSI0PPNhTUGHGm+7uZcSg4OUqrl8LNhGggzk9jyynYmBSZ7yvHciTsIGGW27OmhURELTKXh8bllHAU3kdfx0HwpBSJyx+/glkILE1ys5vKtWRYLRZ7f8L5sHwU0iNDzzYU1Bhxpvu7mXEoODlKq5fCzYRoIM5PY8sp2JgUme8rx3Ik7CBhltuzpoVERC0yl4fG5ZRwFN5HX8dB8KQUicsfv4A==');
  audio.play().catch(() => {});
};
