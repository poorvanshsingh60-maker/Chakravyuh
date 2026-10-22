export interface Skill {
  id: string;
  name: string;
  category: 'CORE_ALGORITHMS' | 'SYSTEM_DESIGN' | 'BEHAVIORAL' | 'DOMAIN_SPECIFIC';
  description?: string;
  certifiedInterviewerCount?: number;
}
