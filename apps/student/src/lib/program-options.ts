export interface ProgramOption {
  name: string;
  fee: number;
}

export const studentProgramOptions: ProgramOption[] = [
  { name: "Digital Marketing", fee: 20000 },
  { name: "Virtual Assistance", fee: 30000 },
  { name: "Product Design", fee: 30000 },
  { name: "Frontend Development", fee: 30000 },
];

export function getProgramOptionByName(name: string) {
  return studentProgramOptions.find((program) => program.name === name) ?? null;
}
