export const validEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export const processPieData = (data, threshold = 0.05) => {
  if (!data || data.length === 0) return [];
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  if (total === 0) return [];

  const mainSlices = [];
  let otherAmount = 0;

  data.forEach(item => {
      if (item.amount / total < threshold) {
          otherAmount += item.amount;
      } else {
          mainSlices.push({ name: item.category, amount: item.amount });
      }
  });

  if (otherAmount > 0) {
      mainSlices.push({ name: "Other", amount: otherAmount });
  }

  mainSlices.sort((a, b) => {
      if (a.name === "Other") return 1;
      if (b.name === "Other") return -1;
      return b.amount - a.amount;
  });

  return mainSlices;
};