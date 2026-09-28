export const raceOptions = ["Qidfa", "Al Lahbab", "Falaj Al Mualla", "Al Shuwaib", "Masfout", "Al Rams", "Wadi Al-Helo", "Other"] as const;
export type ContactInput = { name: string; email: string; phone: string; message: string; races: string[] };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;
export const isEmail = (value: string) => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value) && value.length <= 254;

export function validateContact(value: unknown, allowedRaceOptions: readonly string[] = raceOptions): { data: ContactInput; errors: ContactErrors } {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const string = (key: string) => typeof input[key] === "string" ? input[key].trim() : "";
  const data: ContactInput = { name: string("name"), email: string("email").toLowerCase(), phone: string("phone"), message: string("message"), races: [] };
  const errors: ContactErrors = {};
  if (data.name.length < 2 || data.name.length > 100 || /[\r\n\x00-\x1f]/.test(data.name)) errors.name = "Please enter your full name (2–100 characters).";
  if (!isEmail(data.email)) errors.email = "Please enter a valid email address.";
  if (!/^[+\d() .-]{7,30}$/.test(data.phone) || data.phone.replace(/\D/g, "").length < 7) errors.phone = "Please enter a valid phone number, including your country code.";
  if (data.message.length < 10 || data.message.length > 5000) errors.message = "Please enter a message between 10 and 5,000 characters.";
  if (!Array.isArray(input.races) || input.races.length < 1 || input.races.length > allowedRaceOptions.length || !input.races.every((race) => typeof race === "string" && allowedRaceOptions.includes(race))) {
    errors.races = "Please choose a race or select Other.";
  } else {
    data.races = [...new Set(input.races as string[])];
  }
  return { data, errors };
}
