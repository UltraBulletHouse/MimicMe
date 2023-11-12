export const getStoredAnimal = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('chosenAnimal=')) {
      const storedAnimal = JSON.parse(cookie.substring('chosenAnimal='.length, cookie.length));
      return storedAnimal;
    }
  }
  return null;
}