/**
 * Normalização e tradução de erros da API.
 *
 * O backend retorna erros em formato próximo de ProblemDetail (RFC 7807):
 *   { type, title, status, detail, instance, timestamp, errors? }
 * Há pequenas variações entre o handler global, os handlers de segurança
 * (401/403) e o rate limiter (429) — este módulo uniformiza tudo.
 */

// Mensagens de negócio do backend ainda chegam em inglês — traduzimos aqui.
const TRANSLATIONS = {
  'Time slot has reached its maximum capacity.':
    'Este horário já atingiu a capacidade máxima.',
  'Adopter already has an appointment for this time slot.':
    'Você já tem um agendamento neste horário.',
  'Cannot schedule an appointment for a past date':
    'Não é possível agendar para uma data passada.',
  'Cannot cancel an appointment that is already COMPLETED.':
    'Este agendamento já foi concluído e não pode ser cancelado.',
  'Cannot update result for an appointment that is already COMPLETED.':
    'Este agendamento já foi concluído.',
  'Error: Email is already in use!': 'Este e-mail já está cadastrado.',
  'Invalid email or password': 'E-mail ou senha inválidos.',
  'You do not have permission to cancel this appointment.':
    'Você não tem permissão para cancelar este agendamento.',
  'You do not have permission to view this appointment.':
    'Você não tem permissão para ver este agendamento.',
  'Maximum limit of': 'Limite de fotos por pet atingido.',
  'Invalid file type': 'Formato de arquivo inválido. Use JPEG, PNG ou WebP.',
  'File size exceeds': 'A imagem excede o limite de 5 MB.',
  // DataIntegrityViolation messages (already in PT-BR, pass through)
  'A operação conflita com o estado atual dos dados.':
    'A operação conflita com o estado atual dos dados.',
};

function translate(detail) {
  if (!detail) return null;
  for (const [en, pt] of Object.entries(TRANSLATIONS)) {
    if (detail.startsWith(en)) return pt;
  }
  return detail;
}

/**
 * Converte qualquer erro do Axios num objeto previsível para a UI.
 * @returns {{status:number, title:string, message:string,
 *            fieldErrors:Object|null, retryAfter:number|null}}
 */
export function parseApiError(error) {
  const data = error?.response?.data ?? {};
  const status = data.status ?? error?.response?.status ?? 0;
  const retryHeader = error?.response?.headers?.['retry-after'];

  let message = translate(data.detail);
  if (!message) {
    if (status === 0) message = 'Não foi possível conectar ao servidor.';
    else message = error?.message ?? 'Ocorreu um erro inesperado.';
  }

  return {
    status,
    title: data.title ?? 'Erro',
    message,
    fieldErrors: data.errors ?? null,
    retryAfter: retryHeader ? Number(retryHeader) : null,
  };
}
