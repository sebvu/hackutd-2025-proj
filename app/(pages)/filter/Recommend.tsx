/*
class for reccomending the car
will use the specifications and keywords for filtering and matching
algo should be here
the result should eventually include the keywords and aspects that were used to matchmake
so that the AI can use it to draft a summary of the result
*/
type UserPreferences = {
  budget?: { min: number; max: number };

  model?: string;
  bodyType?: string;
  fuelType?: string;
  horsepower?: number;
  torque?: number;
  mileageCity?: { min: number; max: number };
  mileageHighway?: { min: number; max: number };
  weight?: { min: number; max: number };
  transmission_type?: string;
  tankSize?: number;
  acceleration?: number;
  seats?: number;
  allWheelDrive?: boolean;

  keywords: string[];
};

export class Recommend {
  private preferences: UserPreferences;
  private processingState: 'initial' | 'gathering_preferences' | 'ready' = 'initial';

  constructor() {
    // Initialize with empty preferences
    this.preferences = {
      keywords: []
    };
  }

  // Merge partial preferences into internal state. New values overwrite previous ones.
  // For nested objects (ranges) we merge keys so partial ranges are preserved.
  public updatePreferences(update: Partial<UserPreferences>) {
    const merged: any = { ...this.preferences };

    for (const key of Object.keys(update) as (keyof UserPreferences)[]) {
      const val = update[key];
      if (val === undefined) continue;

      // If both current and incoming are plain objects (range-like), shallow-merge.
      if (
        typeof val === 'object' &&
        val !== null &&
        !Array.isArray(val) &&
        typeof merged[key] === 'object' &&
        merged[key] !== null
      ) {
        merged[key] = { ...(merged[key] as any), ...(val as any) };
      } else if (Array.isArray(val)) {
        // For arrays (keywords), dedupe and append
        const cur = (merged[key] as any[]) || [];
        merged[key] = Array.from(new Set([...cur, ...val]));
      } else {
        merged[key] = val as any;
      }
    }

    this.preferences = merged as UserPreferences;
    this.processingState = 'gathering_preferences';
  }

  // Generate a human-readable recommendation summary based on preferences.
  public generateRecommendation(): string {
    this.processingState = 'ready';
    const p = this.preferences;
    const parts: string[] = [];

    if (p.budget) {
      const min = p.budget.min ? `$${p.budget.min}` : '';
      const max = p.budget.max ? `$${p.budget.max}` : '';
      if (min && max) parts.push(`budget: ${min}–${max}`);
      else if (max) parts.push(`budget: up to ${max}`);
      else if (min) parts.push(`budget: from ${min}`);
    }

    if (p.bodyType) parts.push(`body: ${p.bodyType}`);
    if (p.model) parts.push(`model: ${p.model}`);
    if (p.fuelType) parts.push(`fuel: ${p.fuelType}`);
    if (p.horsepower) parts.push(`horsepower: ${p.horsepower}`);
    if (p.torque) parts.push(`torque: ${p.torque}`);
    if (p.mileageCity) parts.push(`city mpg: ${p.mileageCity.min ?? '-'}–${p.mileageCity.max ?? '-'}`);
    if (p.mileageHighway) parts.push(`highway mpg: ${p.mileageHighway.min ?? '-'}–${p.mileageHighway.max ?? '-'}`);
    if (p.weight) parts.push(`weight: ${p.weight.min ?? '-'}–${p.weight.max ?? '-'}`);
    if (p.transmission_type) parts.push(`transmission: ${p.transmission_type}`);
    if (p.tankSize) parts.push(`tank size: ${p.tankSize}`);
    if (p.acceleration) parts.push(`0-60: ${p.acceleration}s`);
    if (p.seats) parts.push(`seats: ${p.seats}`);
    if (p.allWheelDrive) parts.push(`drivetrain: AWD preferred`);
    if (p.keywords && p.keywords.length) parts.push(`keywords: ${p.keywords.join(', ')}`);

    if (parts.length === 0) return 'No preferences specified yet.';
    return `Recommendation summary — ${parts.join('; ')}.`;
  }
 
  public getCurrentPreferences(): UserPreferences {
    return { ...this.preferences };
  }
}
