export function formatNumberIT(n, decimals = 2, currency = false) {
  if (typeof n !== "number" || isNaN(n)) return "-";
  if (decimals < 0) decimals = 0;

  const [integerPart, decimalPart = ""] = n.toFixed(decimals).split(".");
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return Number.isInteger(n) && !currency ? formattedIntegerPart : `${formattedIntegerPart},${decimalPart}`;
}

export function price(price) {
  if (!price) return "0.00 €";
  return formatNumberIT(price, 2, true) + " €";
}
