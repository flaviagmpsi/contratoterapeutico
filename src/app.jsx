import { useState, useCallback } from "react";

/* ════════════════════════════════════════════
   CONSTANTS & PALETTE
   ════════════════════════════════════════════ */
const C = {
  bg: "#0B1120", sidebar: "#0f172a", sidebarHover: "#1e293b",
  accent: "#818cf8", accentBright: "#a5b4fc", accentDim: "#4f46e5",
  surface: "#f8fafc", paper: "#ffffff",
  text: "#1e293b", muted: "#64748b", light: "#94a3b8",
  border: "#e2e8f0", borderDark: "#334155",
  green: "#34d399", greenDim: "#065f46",
  warn: "#fbbf24", warnBg: "#fffbeb",
  red: "#f87171",
};

/* ════════════════════════════════════════════
   DEFAULT CONTRACT DATA
   ════════════════════════════════════════════ */
const DEFAULT_DATA = {
  pac_nome: "",
  pac_nacionalidade: "",
  pac_profissao: "",
  pac_cpf: "",
  pac_endereco: "",
  psi_nome: "Flávia Gonçalves Moreira",
  psi_nacionalidade: "Brasileira, solteira",
  psi_crp: "04/84615",
  psi_cpf: "019.572.736-31",
  psi_endereco: "Rua Rio Negro, 1048, Barroca, Belo Horizonte/MG — CEP 30431-058",
  srv_modalidade: "",
  srv_duracao: "",
  srv_frequencia: "",
  srv_horario: "",
  fin_sessao: "",
  fin_mensal: "",
  fin_vencimento: "",
  fin_plano: "B",
  vig_meses: "",
  vig_data: "",
  vig_foro: "Comarca de Belo Horizonte/MG",
};

const DEFAULT_DATA_MENOR = {
  resp_nome: "",
  resp_nacionalidade: "",
  resp_profissao: "",
  resp_cpf: "",
  resp_endereco: "",
  resp_parentesco: "",
  pac_nome: "",
  pac_nascimento: "",
  psi_nome: "Flávia Gonçalves Moreira",
  psi_nacionalidade: "Brasileira, solteira",
  psi_crp: "04/84615",
  psi_cpf: "019.572.736-31",
  psi_endereco: "Rua Rio Negro, 1048, Barroca, Belo Horizonte/MG — CEP 30431-058",
  srv_modalidade: "",
  srv_duracao: "",
  srv_frequencia: "",
  srv_horario: "",
  fin_sessao: "",
  fin_mensal: "",
  fin_vencimento: "",
  fin_plano: "B",
  vig_meses: "",
  vig_data: "",
  vig_foro: "Comarca de Belo Horizonte/MG",
};

/* ════════════════════════════════════════════
   CONTRACT FIELD DEFINITIONS
   ════════════════════════════════════════════ */
const FIELD_GROUPS = [
  {
    title: "Dados do(a) Consulente (Contratante)",
    icon: "👤",
    fields: [
      { id: "pac_nome", label: "Nome Completo", type: "text", ph: "Nome completo do(a) consulente" },
      { id: "pac_nacionalidade", label: "Nacionalidade / Estado Civil", type: "text", ph: "Ex: Brasileiro(a), solteiro(a)" },
      { id: "pac_profissao", label: "Profissão", type: "text", ph: "Profissão do(a) consulente" },
      { id: "pac_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "pac_endereco", label: "Endereço Completo", type: "text", ph: "Rua, número, bairro — CEP" },
    ]
  },
  {
    title: "Dados da Psicóloga (Contratada)",
    icon: "🧠",
    fields: [
      { id: "psi_nome", label: "Nome Completo", type: "text", ph: "Nome da Psicóloga" },
      { id: "psi_nacionalidade", label: "Nacionalidade / Estado Civil", type: "text", ph: "Ex: Brasileira, solteira" },
      { id: "psi_crp", label: "CRP", type: "text", ph: "XX/XXXXX" },
      { id: "psi_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "psi_endereco", label: "Endereço do Consultório", type: "text", ph: "Endereço completo" },
    ]
  },
  {
    title: "Condições do Serviço",
    icon: "📋",
    fields: [
      { id: "srv_modalidade", label: "Modalidade", type: "text", ph: "Ex: Psicoterapia" },
      { id: "srv_duracao", label: "Duração das sessões", type: "text", ph: "Ex: 50 a 60 minutos" },
      { id: "srv_frequencia", label: "Frequência", type: "text", ph: "Ex: 1 vez por semana" },
      { id: "srv_horario", label: "Horário", type: "text", ph: "A combinar entre as partes" },
    ]
  },
  {
    title: "Condições Financeiras",
    icon: "💰",
    fields: [
      { id: "fin_sessao", label: "Valor por sessão (R$)", type: "text", ph: "Ex: 100,00" },
      { id: "fin_mensal", label: "Valor da mensalidade (R$)", type: "text", ph: "Ex: 400,00" },
      { id: "fin_vencimento", label: "Vencimento", type: "text", ph: "Até o 5º dia útil de cada mês" },
      { id: "fin_plano", label: "Plano de Mensalidade", type: "select", opts: [
        { value: "B", label: "Mensalidade B (valor social/democrático)" },
        { value: "A", label: "Mensalidade A (R$ 800,00)" },
      ]},
    ]
  },
  {
    title: "Vigência e Assinatura",
    icon: "📅",
    fields: [
      { id: "vig_meses", label: "Vigência (meses)", type: "text", ph: "Ex: 12" },
      { id: "vig_data", label: "Data de assinatura", type: "text", ph: "Ex: 06 de março de 2026" },
      { id: "vig_foro", label: "Foro", type: "text", ph: "Comarca de Belo Horizonte/MG" },
    ]
  },
];

const FIELD_GROUPS_MENOR = [
  {
    title: "Dados do(a) Responsável (Contratante)",
    icon: "👤",
    fields: [
      { id: "resp_nome", label: "Nome Completo", type: "text", ph: "Nome completo do(a) responsável" },
      { id: "resp_nacionalidade", label: "Nacionalidade / Estado Civil", type: "text", ph: "Ex: Brasileira, casada" },
      { id: "resp_profissao", label: "Profissão", type: "text", ph: "Profissão do(a) responsável" },
      { id: "resp_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "resp_endereco", label: "Endereço Completo", type: "text", ph: "Rua, número, bairro — CEP" },
      { id: "resp_parentesco", label: "Parentesco com o(a) paciente", type: "text", ph: "Ex: Mãe, Pai, Avó" },
    ]
  },
  {
    title: "Dados do(a) Paciente (Menor)",
    icon: "🧒",
    fields: [
      { id: "pac_nome", label: "Nome Completo", type: "text", ph: "Nome completo do(a) menor" },
      { id: "pac_nascimento", label: "Data de Nascimento", type: "text", ph: "Ex: 15 de janeiro de 2015" },
    ]
  },
  {
    title: "Dados da Psicóloga (Contratada)",
    icon: "🧠",
    fields: [
      { id: "psi_nome", label: "Nome Completo", type: "text", ph: "Nome da Psicóloga" },
      { id: "psi_nacionalidade", label: "Nacionalidade / Estado Civil", type: "text", ph: "Ex: Brasileira, solteira" },
      { id: "psi_crp", label: "CRP", type: "text", ph: "XX/XXXXX" },
      { id: "psi_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "psi_endereco", label: "Endereço do Consultório", type: "text", ph: "Endereço completo" },
    ]
  },
  {
    title: "Condições do Serviço",
    icon: "📋",
    fields: [
      { id: "srv_modalidade", label: "Modalidade", type: "text", ph: "Ex: Psicoterapia" },
      { id: "srv_duracao", label: "Duração das sessões", type: "text", ph: "Ex: 50 a 60 minutos" },
      { id: "srv_frequencia", label: "Frequência", type: "text", ph: "Ex: 1 vez por semana" },
      { id: "srv_horario", label: "Horário", type: "text", ph: "A combinar entre as partes" },
    ]
  },
  {
    title: "Condições Financeiras",
    icon: "💰",
    fields: [
      { id: "fin_sessao", label: "Valor por sessão (R$)", type: "text", ph: "Ex: 100,00" },
      { id: "fin_mensal", label: "Valor da mensalidade (R$)", type: "text", ph: "Ex: 400,00" },
      { id: "fin_vencimento", label: "Vencimento", type: "text", ph: "Até o 5º dia útil de cada mês" },
      { id: "fin_plano", label: "Plano de Mensalidade", type: "select", opts: [
        { value: "B", label: "Mensalidade B (valor social/democrático)" },
        { value: "A", label: "Mensalidade A (R$ 800,00)" },
      ]},
    ]
  },
  {
    title: "Vigência e Assinatura",
    icon: "📅",
    fields: [
      { id: "vig_meses", label: "Vigência (meses)", type: "text", ph: "Ex: 12" },
      { id: "vig_data", label: "Data de assinatura", type: "text", ph: "Ex: 06 de março de 2026" },
      { id: "vig_foro", label: "Foro", type: "text", ph: "Comarca de Belo Horizonte/MG" },
    ]
  },
];

/* ════════════════════════════════════════════
   SIDEBAR CLAUSE DEFINITIONS (with IDs)
   ════════════════════════════════════════════ */
const CLAUSE_ITEMS = [
  { icon: "📋", label: "Do Objeto", id: "clausula-1" },
  { icon: "💰", label: "Da Remuneração", id: "clausula-2" },
  { icon: "📅", label: "Desmarcações e Faltas", id: "clausula-3" },
  { icon: "🗓️", label: "Meses com 5 Semanas", id: "clausula-4" },
  { icon: "🏖️", label: "Feriados e Férias", id: "clausula-5" },
  { icon: "⏸️", label: "Pausa ou Interrupção", id: "clausula-6" },
  { icon: "⏳", label: "Da Vigência", id: "clausula-7" },
  { icon: "⚖️", label: "Do Foro", id: "clausula-8" },
];

const CLAUSE_ITEMS_MENOR = [
  { icon: "📋", label: "Do Objeto", id: "clausula-m-1" },
  { icon: "💰", label: "Da Remuneração", id: "clausula-m-2" },
  { icon: "📅", label: "Desmarcações e Faltas", id: "clausula-m-3" },
  { icon: "🗓️", label: "Meses com 5 Semanas", id: "clausula-m-4" },
  { icon: "🏖️", label: "Feriados e Férias", id: "clausula-m-5" },
  { icon: "⏸️", label: "Pausa ou Interrupção", id: "clausula-m-6" },
  { icon: "👥", label: "Reuniões com Responsável", id: "clausula-m-7" },
  { icon: "⏳", label: "Da Vigência", id: "clausula-m-8" },
  { icon: "⚖️", label: "Do Foro", id: "clausula-m-9" },
];

/* ════════════════════════════════════════════
   EXPORT UTILITIES
   ════════════════════════════════════════════ */
function valorPorExtenso(val) {
  const unidades = ["","um","dois","três","quatro","cinco","seis","sete","oito","nove"];
  const especiais = ["dez","onze","doze","treze","quatorze","quinze","dezesseis","dezessete","dezoito","dezenove"];
  const dezenas = ["","","vinte","trinta","quarenta","cinquenta","sessenta","setenta","oitenta","noventa"];
  const centenas = ["","cento","duzentos","trezentos","quatrocentos","quinhentos","seiscentos","setecentos","oitocentos","novecentos"];

  const str = String(val).replace(/\./g, "").replace(",00","").replace(",",".");
  const num = parseFloat(str);
  if (isNaN(num) || num <= 0) return val;
  if (num === 100) return "cem";
  if (num === 1000) return "mil";

  const partes = [];
  const milhar = Math.floor(num / 1000);
  const resto = Math.floor(num % 1000);
  const cent = Math.floor(resto / 100);
  const dez = Math.floor((resto % 100) / 10);
  const uni = resto % 10;

  if (milhar > 0) {
    if (milhar === 1) partes.push("mil");
    else partes.push(unidades[milhar] + " mil");
  }
  if (cent > 0) {
    if (cent === 1 && dez === 0 && uni === 0) partes.push("cem");
    else partes.push(centenas[cent]);
  }
  if (dez === 1) {
    partes.push(especiais[uni]);
  } else {
    const d = [];
    if (dez > 1) d.push(dezenas[dez]);
    if (uni > 0) d.push(unidades[uni]);
    if (d.length) partes.push(d.join(" e "));
  }

  return partes.join(" e ") || val;
}

function mesesPorExtenso(m) {
  const map = { 1:"um",2:"dois",3:"três",4:"quatro",5:"cinco",6:"seis",
    7:"sete",8:"oito",9:"nove",10:"dez",11:"onze",12:"doze",
    18:"dezoito",24:"vinte e quatro"};
  return map[parseInt(m)] || m;
}

function buildContractHTML(d) {
  const sec = (title) => `<h2 style="font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt;font-weight:700;">${title}</h2>`;
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;

  return `
<h1 style="font-size:15pt;text-align:center;margin-bottom:20pt;letter-spacing:0.5pt;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PSICOTERAPIA</h1>

${sec("DAS PARTES")}

${p(`<b>CONTRATANTE:</b> ${d.pac_nome}, ${d.pac_nacionalidade}, ${d.pac_profissao}, inscrito(a) no CPF sob o nº ${d.pac_cpf}, residente e domiciliado(a) no endereço ${d.pac_endereco}, doravante denominado(a) CONTRATANTE.`)}

${p(`<b>CONTRATADA:</b> ${d.psi_nome}, ${d.psi_nacionalidade}, Psicóloga, inscrita no Conselho Regional de Psicologia sob o CRP ${d.psi_crp}, inscrita no CPF sob o nº ${d.psi_cpf}, com consultório situado na ${d.psi_endereco}, doravante denominada CONTRATADA.`)}

${p("As partes acima identificadas celebram o presente contrato de prestação de serviços de psicoterapia, que será regido pelas cláusulas e condições a seguir:")}

${sec("CLÁUSULA PRIMEIRA — DO OBJETO")}

${p(`1.1. O presente contrato tem por objeto a prestação de serviços de ${d.srv_modalidade} pela CONTRATADA ao(à) CONTRATANTE, em sessões individuais com duração de ${d.srv_duracao}, com frequência de ${d.srv_frequencia}.`)}

${p(`1.2. O horário das sessões será ${d.srv_horario.toLowerCase()}, em dia e horário fixo semanal, previamente combinado e reservado exclusivamente para o(a) CONTRATANTE.`)}

${p("1.3. O acompanhamento psicológico é regido por princípios éticos, especialmente no que diz respeito ao sigilo profissional. Tudo o que é compartilhado em sessão é protegido por confidencialidade, conforme o Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005).")}

${sec("CLÁUSULA SEGUNDA — DA REMUNERAÇÃO E FORMA DE PAGAMENTO")}

${p(`2.1. O(A) CONTRATANTE pagará à CONTRATADA o valor mensal de R$ ${d.fin_mensal} (${valorPorExtenso(d.fin_mensal)} reais), correspondente ao valor de R$ ${d.fin_sessao} (${valorPorExtenso(d.fin_sessao)} reais) por sessão, em regime de mensalidade.`)}

${p(`2.2. A mensalidade deverá ser paga ${d.fin_vencimento.toLowerCase()}.`)}

${p("2.3. A mensalidade contempla: a reserva e proteção do horário na agenda da CONTRATADA; a manutenção da clínica e do serviço; os encontros terapêuticos semanais; e o desenvolvimento contínuo e personalizado do acompanhamento.")}

${sec("CLÁUSULA TERCEIRA — DAS DESMARCAÇÕES E FALTAS")}

${p("3.1. Quando o(a) CONTRATANTE desmarcar uma sessão, a mensalidade é mantida, pois o horário segue reservado. A reposição pode ser combinada apenas se houver disponibilidade de agenda, não sendo garantida.")}

${p("3.2. Faltas sem aviso prévio de pelo menos 24 (vinte e quatro) horas de antecedência serão cobradas normalmente como sessão realizada.")}

${p("3.3. Faltas com aviso antecipado possibilitam a reposição da sessão na mesma semana, conforme disponibilidade de agenda.")}

${p("3.4. Quando a CONTRATADA desmarcar uma sessão, buscará oferecer reposição dentro do mesmo mês. Caso o(a) CONTRATANTE não possa comparecer ao horário proposto, o valor da sessão será descontado da mensalidade seguinte.")}

${sec("CLÁUSULA QUARTA — DOS MESES COM CINCO SEMANAS")}

${p("4.1. A mensalidade refere-se ao período mensal de acompanhamento, independentemente de o mês ter quatro ou cinco semanas. Em meses com cinco semanas, a quinta sessão está garantida sem cobrança adicional, desde que haja disponibilidade de agenda. Essa sessão extra compensa os períodos de férias da CONTRATADA, durante os quais a mensalidade é mantida conforme previsto na Cláusula Quinta.")}

${sec("CLÁUSULA QUINTA — DOS FERIADOS E FÉRIAS")}

${p("5.1. Sessões que coincidirem com feriados não são automaticamente repostas. Havendo disponibilidade de agenda, a reposição pode ser combinada.")}

${p("5.2. Férias ou viagens do(a) CONTRATANTE não suspendem a mensalidade, pois o horário e o espaço seguem reservados.")}

${p("5.3. A CONTRATADA poderá usufruir de até dois períodos de férias ao longo do ano, previamente comunicados ao(à) CONTRATANTE. As férias, contabilizando 30 dias, serão distribuídas em duas quinzenas em épocas distintas do ano. O valor da mensalidade será mantido durante as férias para a garantia da reserva do horário e manutenção dos serviços da clínica.")}

${sec("CLÁUSULA SEXTA — DA PAUSA OU INTERRUPÇÃO DO PROCESSO")}

${p("6.1. Caso o(a) CONTRATANTE decida pausar ou interromper o acompanhamento, é necessário comunicar com antecedência, preferencialmente em sessão.")}

${p("6.2. O valor da mensalidade referente ao mês em que a interrupção for avisada permanece devido, pois o horário e o espaço clínico já estavam reservados.")}

${p("6.3. Em caso de pausa, a vaga deixa de ser reservada e poderá ser disponibilizada para outra pessoa, não havendo garantia de manutenção do mesmo horário no retorno.")}

${sec("CLÁUSULA SÉTIMA — DA VIGÊNCIA")}

${p(`7.1. O presente contrato terá vigência de ${d.vig_meses} (${mesesPorExtenso(d.vig_meses)}) meses, contados a partir da data de sua assinatura, podendo ser renovado por acordo entre as partes.`)}

${sec("CLÁUSULA OITAVA — DO FORO")}

${p(`8.1. As partes elegem o foro da ${d.vig_foro} para dirimir quaisquer dúvidas ou controvérsias oriundas do presente contrato, renunciando a qualquer outro, por mais privilegiado que seja.`)}

${p("E por estarem de acordo, as partes assinam o presente contrato em duas vias de igual teor e forma.")}

<p style="text-align:center;margin-top:16pt;">${d.vig_foro.replace("Comarca de ", "")}, ${d.vig_data}.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60pt;text-align:center;">
  <div>
    <p style="margin-top:40pt;">___________________________________________</p>
    <p><b>${d.pac_nome}</b></p>
    <p>CPF: ${d.pac_cpf}</p>
    <p style="font-weight:600;">CONTRATANTE</p>
  </div>
  <div>
    <p style="margin-top:40pt;">___________________________________________</p>
    <p><b>${d.psi_nome}</b></p>
    <p>CRP: ${d.psi_crp}</p>
    <p style="font-weight:600;">CONTRATADA</p>
  </div>
</div>`;
}

function exportDOCX(data) {
  const content = buildContractHTML(data);
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]--><style>@page{size:A4;margin:2cm}body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.5;color:#000}h1{margin-bottom:12pt}h2{margin-top:14pt}p{margin:4pt 0}</style></head><body>${content}</body></html>`;
  const blob = new Blob(["\ufeff"+html], {type:"application/msword"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Contrato_Terapeutico_${data.pac_nome.replace(/\s+/g,"_")}.doc`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function exportPDF(data) {
  const content = buildContractHTML(data);
  const w = window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Contrato Terapêutico</title><style>@page{size:A4;margin:2cm}@media print{body{margin:0}}body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.5;color:#000;max-width:700px;margin:20px auto;padding:20px}h1{font-size:15pt;text-align:center}h2{font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt}p{margin:4pt 0;text-align:justify}</style></head><body>${content}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

/* ════════════════════════════════════════════
   MINOR CONTRACT — BUILD HTML & EXPORT
   ════════════════════════════════════════════ */
function buildContractHTMLMenor(d) {
  const sec = (title) => `<h2 style="font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt;font-weight:700;">${title}</h2>`;
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;

  return `
<h1 style="font-size:15pt;text-align:center;margin-bottom:20pt;letter-spacing:0.5pt;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PSICOTERAPIA<br><span style="font-size:12pt;">(CRIANÇAS E ADOLESCENTES)</span></h1>

${sec("DAS PARTES")}

${p(`<b>CONTRATANTE (RESPONSÁVEL LEGAL):</b> ${d.resp_nome}, ${d.resp_nacionalidade}, ${d.resp_profissao}, inscrito(a) no CPF sob o nº ${d.resp_cpf}, residente e domiciliado(a) no endereço ${d.resp_endereco}, ${d.resp_parentesco} do(a) paciente, doravante denominado(a) CONTRATANTE.`)}

${p(`<b>BENEFICIÁRIO(A) (PACIENTE):</b> ${d.pac_nome}, nascido(a) em ${d.pac_nascimento}, menor de idade, representado(a) neste ato por seu(sua) responsável legal acima qualificado(a).`)}

${p(`<b>CONTRATADA:</b> ${d.psi_nome}, ${d.psi_nacionalidade}, Psicóloga, inscrita no Conselho Regional de Psicologia sob o CRP ${d.psi_crp}, inscrita no CPF sob o nº ${d.psi_cpf}, com consultório situado na ${d.psi_endereco}, doravante denominada CONTRATADA.`)}

${p("As partes acima identificadas celebram o presente contrato de prestação de serviços de psicoterapia para o(a) BENEFICIÁRIO(A), que será regido pelas cláusulas e condições a seguir:")}

${sec("CLÁUSULA PRIMEIRA — DO OBJETO")}

${p(`1.1. O presente contrato tem por objeto a prestação de serviços de ${d.srv_modalidade} pela CONTRATADA ao(à) BENEFICIÁRIO(A), em sessões individuais com duração de ${d.srv_duracao}, com frequência de ${d.srv_frequencia}.`)}

${p(`1.2. O horário das sessões será ${d.srv_horario.toLowerCase()}, em dia e horário fixo semanal, previamente combinado e reservado exclusivamente para o(a) BENEFICIÁRIO(A).`)}

${p("1.3. O acompanhamento psicológico é regido por princípios éticos, especialmente no que diz respeito ao sigilo profissional. Tudo o que é compartilhado em sessão pelo(a) BENEFICIÁRIO(A) é protegido por confidencialidade, conforme o Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005) e o Estatuto da Criança e do Adolescente (Lei nº 8.069/1990).")}

${sec("CLÁUSULA SEGUNDA — DA REMUNERAÇÃO E FORMA DE PAGAMENTO")}

${p(`2.1. O(A) CONTRATANTE pagará à CONTRATADA o valor mensal de R$ ${d.fin_mensal} (${valorPorExtenso(d.fin_mensal)} reais), correspondente ao valor de R$ ${d.fin_sessao} (${valorPorExtenso(d.fin_sessao)} reais) por sessão, em regime de mensalidade.`)}

${p(`2.2. A mensalidade deverá ser paga ${d.fin_vencimento.toLowerCase()}.`)}

${p("2.3. A mensalidade contempla: a reserva e proteção do horário na agenda da CONTRATADA; a manutenção da clínica e do serviço; os encontros terapêuticos semanais; e o desenvolvimento contínuo e personalizado do acompanhamento.")}

${sec("CLÁUSULA TERCEIRA — DAS DESMARCAÇÕES E FALTAS")}

${p("3.1. Quando o(a) CONTRATANTE desmarcar uma sessão do(a) BENEFICIÁRIO(A), a mensalidade é mantida, pois o horário segue reservado. A reposição pode ser combinada apenas se houver disponibilidade de agenda, não sendo garantida.")}

${p("3.2. Faltas sem aviso prévio de pelo menos 24 (vinte e quatro) horas de antecedência serão cobradas normalmente como sessão realizada.")}

${p("3.3. Faltas com aviso antecipado possibilitam a reposição da sessão na mesma semana, conforme disponibilidade de agenda.")}

${p("3.4. Quando a CONTRATADA desmarcar uma sessão, buscará oferecer reposição dentro do mesmo mês. Caso o(a) BENEFICIÁRIO(A) não possa comparecer ao horário proposto, o valor da sessão será descontado da mensalidade seguinte.")}

${sec("CLÁUSULA QUARTA — DOS MESES COM CINCO SEMANAS")}

${p("4.1. A mensalidade refere-se ao período mensal de acompanhamento, independentemente de o mês ter quatro ou cinco semanas. Em meses com cinco semanas, a quinta sessão está garantida sem cobrança adicional, desde que haja disponibilidade de agenda. Essa sessão extra compensa os períodos de férias da CONTRATADA, durante os quais a mensalidade é mantida conforme previsto na Cláusula Quinta.")}

${sec("CLÁUSULA QUINTA — DOS FERIADOS E FÉRIAS")}

${p("5.1. Sessões que coincidirem com feriados não são automaticamente repostas. Havendo disponibilidade de agenda, a reposição pode ser combinada.")}

${p("5.2. Férias ou viagens do(a) BENEFICIÁRIO(A) não suspendem a mensalidade, pois o horário e o espaço seguem reservados.")}

${p("5.3. A CONTRATADA poderá usufruir de até dois períodos de férias ao longo do ano, previamente comunicados ao(à) CONTRATANTE. As férias, contabilizando 30 dias, serão distribuídas em duas quinzenas em épocas distintas do ano. O valor da mensalidade será mantido durante as férias para a garantia da reserva do horário e manutenção dos serviços da clínica.")}

${sec("CLÁUSULA SEXTA — DA PAUSA OU INTERRUPÇÃO DO PROCESSO")}

${p("6.1. Caso o(a) CONTRATANTE decida pausar ou interromper o acompanhamento do(a) BENEFICIÁRIO(A), é necessário comunicar com antecedência, preferencialmente em sessão.")}

${p("6.2. O valor da mensalidade referente ao mês em que a interrupção for avisada permanece devido, pois o horário e o espaço clínico já estavam reservados.")}

${p("6.3. Em caso de pausa, a vaga deixa de ser reservada e poderá ser disponibilizada para outra pessoa, não havendo garantia de manutenção do mesmo horário no retorno.")}

${sec("CLÁUSULA SÉTIMA — DAS REUNIÕES COM O(A) RESPONSÁVEL")}

${p("7.1. A CONTRATADA poderá realizar reuniões eventuais com o(a) CONTRATANTE (responsável legal) para fornecer atualizações necessárias sobre o andamento do processo terapêutico do(a) BENEFICIÁRIO(A).")}

${p("7.2. Tais reuniões terão caráter informativo e de orientação, preservando integralmente o sigilo sobre o conteúdo das sessões do(a) BENEFICIÁRIO(A). Serão compartilhadas apenas as informações estritamente necessárias ao acompanhamento e ao bem-estar do(a) menor, conforme o Código de Ética Profissional do Psicólogo e o Estatuto da Criança e do Adolescente.")}

${p("7.3. O agendamento dessas reuniões será feito em comum acordo entre a CONTRATADA e o(a) CONTRATANTE, conforme a necessidade clínica avaliada pela CONTRATADA.")}

${sec("CLÁUSULA OITAVA — DA VIGÊNCIA")}

${p(`8.1. O presente contrato terá vigência de ${d.vig_meses} (${mesesPorExtenso(d.vig_meses)}) meses, contados a partir da data de sua assinatura, podendo ser renovado por acordo entre as partes.`)}

${sec("CLÁUSULA NONA — DO FORO")}

${p(`9.1. As partes elegem o foro da ${d.vig_foro} para dirimir quaisquer dúvidas ou controvérsias oriundas do presente contrato, renunciando a qualquer outro, por mais privilegiado que seja.`)}

${p("E por estarem de acordo, as partes assinam o presente contrato em duas vias de igual teor e forma.")}

<p style="text-align:center;margin-top:16pt;">${d.vig_foro.replace("Comarca de ", "")}, ${d.vig_data}.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60pt;text-align:center;">
  <div>
    <p style="margin-top:40pt;">___________________________________________</p>
    <p><b>${d.resp_nome}</b></p>
    <p>CPF: ${d.resp_cpf}</p>
    <p style="font-weight:600;">CONTRATANTE (RESPONSÁVEL LEGAL)</p>
  </div>
  <div>
    <p style="margin-top:40pt;">___________________________________________</p>
    <p><b>${d.psi_nome}</b></p>
    <p>CRP: ${d.psi_crp}</p>
    <p style="font-weight:600;">CONTRATADA</p>
  </div>
</div>`;
}

function exportDOCXMenor(data) {
  const content = buildContractHTMLMenor(data);
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]--><style>@page{size:A4;margin:2cm}body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.5;color:#000}h1{margin-bottom:12pt}h2{margin-top:14pt}p{margin:4pt 0}</style></head><body>${content}</body></html>`;
  const blob = new Blob(["\ufeff"+html], {type:"application/msword"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Contrato_Terapeutico_Menor_${data.pac_nome.replace(/\s+/g,"_")}.doc`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

function exportPDFMenor(data) {
  const content = buildContractHTMLMenor(data);
  const w = window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Contrato Terapêutico — Crianças e Adolescentes</title><style>@page{size:A4;margin:2cm}@media print{body{margin:0}}body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.5;color:#000;max-width:700px;margin:20px auto;padding:20px}h1{font-size:15pt;text-align:center}h2{font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt}p{margin:4pt 0;text-align:justify}</style></head><body>${content}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

/* ════════════════════════════════════════════
   SCROLL HELPER
   ════════════════════════════════════════════ */
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ════════════════════════════════════════════
   REACT COMPONENTS
   ════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;background:${C.bg};overflow:hidden}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}
.fade-in{animation:fadeIn .4s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.slide-in{animation:slideIn .35s ease}
@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .app-sidebar{width:56px!important;min-width:56px!important}
  .sidebar-expanded-only{display:none!important}
  .contract-editor-layout{flex-direction:column!important}
  .contract-form-panel{width:100%!important;min-width:0!important;max-height:45vh;border-right:none!important;border-bottom:1px solid #1e293b}
  .contract-preview-panel{padding:16px!important}
  .contract-paper{padding:28px 20px!important}
}
@media(max-width:640px){
  .app-sidebar{width:0px!important;min-width:0px!important;border:none!important}
  .mobile-header{display:flex!important}
  .contract-form-panel{max-height:50vh}
  .contract-paper{padding:20px 14px!important;font-size:10pt!important}
  .contract-actions{flex-wrap:wrap}
}
`;

function Field({ field, value, onChange }) {
  const base = {width:"100%",padding:"10px 14px",borderRadius:8,border:`1px solid ${C.borderDark}`,background:"#1e293b",color:"#e2e8f0",fontSize:13.5,fontFamily:"'DM Sans',sans-serif",outline:"none",transition:"border-color .2s,box-shadow .2s"};
  const focus = {borderColor:C.accent,boxShadow:`0 0 0 3px rgba(129,140,248,0.15)`};
  const [focused, setFocused] = useState(false);
  const style = {...base,...(focused?focus:{})};

  if (field.type === "select") {
    const opts = field.opts || [];
    const isObjOpts = opts.length > 0 && typeof opts[0] === "object";
    return (
      <div style={{marginBottom:14}}>
        <label style={{display:"block",fontSize:11.5,color:C.light,marginBottom:4,fontWeight:500,letterSpacing:.3}}>{field.label}</label>
        <select value={value||""} onChange={e=>onChange(e.target.value)} style={{...style,cursor:"pointer"}}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}>
          {isObjOpts
            ? opts.map(o=><option key={o.value} value={o.value}>{o.label}</option>)
            : opts.map(o=><option key={o} value={o}>{o}</option>)
          }
        </select>
      </div>
    );
  }
  return (
    <div style={{marginBottom:14}}>
      <label style={{display:"block",fontSize:11.5,color:C.light,marginBottom:4,fontWeight:500,letterSpacing:.3}}>{field.label}</label>
      <input type="text" value={value||""} onChange={e=>onChange(e.target.value)} placeholder={field.ph}
        style={style} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} />
    </div>
  );
}

function ActionBtn({ label, color, onClick }) {
  return (
    <button onClick={onClick}
      style={{background:color,color:"#fff",border:"none",borderRadius:8,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"transform .15s,box-shadow .15s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow=`0 4px 16px ${color}44`}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
      {label}
    </button>
  );
}

function ContractPaperContent({ data }) {
  const d = { ...DEFAULT_DATA, ...data };
  const v = (id) => d[id] || `[${id}]`;
  const empty = (id) => !data[id];
  const ph = (id) => empty(id) ? {color:"#94a3b8",fontStyle:"italic"} : {};
  const secStyle = {fontSize:"13pt",color:"#1a365d",borderBottom:"1pt solid #2b6cb0",paddingBottom:3,marginTop:18,marginBottom:8,fontWeight:700};

  return (
    <>
      <h1 style={{textAlign:"center",fontSize:"15pt",marginBottom:20,letterSpacing:.5}}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PSICOTERAPIA</h1>

      <h2 style={secStyle}>DAS PARTES</h2>

      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>
        <b>CONTRATANTE:</b> <span style={ph("pac_nome")}>{v("pac_nome")}</span>, <span style={ph("pac_nacionalidade")}>{v("pac_nacionalidade")}</span>, <span style={ph("pac_profissao")}>{v("pac_profissao")}</span>, inscrito(a) no CPF sob o nº <span style={ph("pac_cpf")}>{v("pac_cpf")}</span>, residente e domiciliado(a) no endereço <span style={ph("pac_endereco")}>{v("pac_endereco")}</span>, doravante denominado(a) CONTRATANTE.
      </p>

      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>
        <b>CONTRATADA:</b> <span style={ph("psi_nome")}>{v("psi_nome")}</span>, <span style={ph("psi_nacionalidade")}>{v("psi_nacionalidade")}</span>, Psicóloga, inscrita no Conselho Regional de Psicologia sob o CRP <span style={ph("psi_crp")}>{v("psi_crp")}</span>, inscrita no CPF sob o nº <span style={ph("psi_cpf")}>{v("psi_cpf")}</span>, com consultório situado na <span style={ph("psi_endereco")}>{v("psi_endereco")}</span>, doravante denominada CONTRATADA.
      </p>

      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>As partes acima identificadas celebram o presente contrato de prestação de serviços de psicoterapia, que será regido pelas cláusulas e condições a seguir:</p>

      <h2 id="clausula-1" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA PRIMEIRA — DO OBJETO</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>1.1. O presente contrato tem por objeto a prestação de serviços de <span style={ph("srv_modalidade")}>{v("srv_modalidade")}</span> pela CONTRATADA ao(à) CONTRATANTE, em sessões individuais com duração de <span style={ph("srv_duracao")}>{v("srv_duracao")}</span>, com frequência de <span style={ph("srv_frequencia")}>{v("srv_frequencia")}</span>.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>1.2. O horário das sessões será <span style={ph("srv_horario")}>{v("srv_horario").toLowerCase()}</span>, em dia e horário fixo semanal, previamente combinado e reservado exclusivamente para o(a) CONTRATANTE.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>1.3. O acompanhamento psicológico é regido por princípios éticos, especialmente no que diz respeito ao sigilo profissional. Tudo o que é compartilhado em sessão é protegido por confidencialidade, conforme o Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005).</p>

      <h2 id="clausula-2" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA SEGUNDA — DA REMUNERAÇÃO E FORMA DE PAGAMENTO</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>2.1. O(A) CONTRATANTE pagará à CONTRATADA o valor mensal de R$ <span style={ph("fin_mensal")}>{v("fin_mensal")}</span> ({valorPorExtenso(v("fin_mensal"))} reais), correspondente ao valor de R$ <span style={ph("fin_sessao")}>{v("fin_sessao")}</span> ({valorPorExtenso(v("fin_sessao"))} reais) por sessão, em regime de mensalidade.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>2.2. A mensalidade deverá ser paga <span style={ph("fin_vencimento")}>{v("fin_vencimento").toLowerCase()}</span>.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>2.3. A mensalidade contempla: a reserva e proteção do horário na agenda da CONTRATADA; a manutenção da clínica e do serviço; os encontros terapêuticos semanais; e o desenvolvimento contínuo e personalizado do acompanhamento.</p>

      <h2 id="clausula-3" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA TERCEIRA — DAS DESMARCAÇÕES E FALTAS</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>3.1. Quando o(a) CONTRATANTE desmarcar uma sessão, a mensalidade é mantida, pois o horário segue reservado. A reposição pode ser combinada apenas se houver disponibilidade de agenda, não sendo garantida.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>3.2. Faltas sem aviso prévio de pelo menos 24 (vinte e quatro) horas de antecedência serão cobradas normalmente como sessão realizada.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>3.3. Faltas com aviso antecipado possibilitam a reposição da sessão na mesma semana, conforme disponibilidade de agenda.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>3.4. Quando a CONTRATADA desmarcar uma sessão, buscará oferecer reposição dentro do mesmo mês. Caso o(a) CONTRATANTE não possa comparecer ao horário proposto, o valor da sessão será descontado da mensalidade seguinte.</p>

      <h2 id="clausula-4" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA QUARTA — DOS MESES COM CINCO SEMANAS</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>4.1. A mensalidade refere-se ao período mensal de acompanhamento, independentemente de o mês ter quatro ou cinco semanas. Em meses com cinco semanas, a quinta sessão está garantida sem cobrança adicional, desde que haja disponibilidade de agenda. Essa sessão extra compensa os períodos de férias da CONTRATADA, durante os quais a mensalidade é mantida conforme previsto na Cláusula Quinta.</p>

      <h2 id="clausula-5" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA QUINTA — DOS FERIADOS E FÉRIAS</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>5.1. Sessões que coincidirem com feriados não são automaticamente repostas. Havendo disponibilidade de agenda, a reposição pode ser combinada.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>5.2. Férias ou viagens do(a) CONTRATANTE não suspendem a mensalidade, pois o horário e o espaço seguem reservados.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>5.3. A CONTRATADA poderá usufruir de até dois períodos de férias ao longo do ano, previamente comunicados ao(à) CONTRATANTE. As férias, contabilizando 30 dias, serão distribuídas em duas quinzenas em épocas distintas do ano. O valor da mensalidade será mantido durante as férias para a garantia da reserva do horário e manutenção dos serviços da clínica.</p>

      <h2 id="clausula-6" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA SEXTA — DA PAUSA OU INTERRUPÇÃO DO PROCESSO</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>6.1. Caso o(a) CONTRATANTE decida pausar ou interromper o acompanhamento, é necessário comunicar com antecedência, preferencialmente em sessão.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>6.2. O valor da mensalidade referente ao mês em que a interrupção for avisada permanece devido, pois o horário e o espaço clínico já estavam reservados.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>6.3. Em caso de pausa, a vaga deixa de ser reservada e poderá ser disponibilizada para outra pessoa, não havendo garantia de manutenção do mesmo horário no retorno.</p>

      <h2 id="clausula-7" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA SÉTIMA — DA VIGÊNCIA</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>7.1. O presente contrato terá vigência de <span style={ph("vig_meses")}>{v("vig_meses")}</span> ({mesesPorExtenso(v("vig_meses"))}) meses, contados a partir da data de sua assinatura, podendo ser renovado por acordo entre as partes.</p>

      <h2 id="clausula-8" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA OITAVA — DO FORO</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>8.1. As partes elegem o foro da <span style={ph("vig_foro")}>{v("vig_foro")}</span> para dirimir quaisquer dúvidas ou controvérsias oriundas do presente contrato, renunciando a qualquer outro, por mais privilegiado que seja.</p>

      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>E por estarem de acordo, as partes assinam o presente contrato em duas vias de igual teor e forma.</p>

      <p style={{textAlign:"center",marginTop:16}}><span style={ph("vig_foro")}>{v("vig_foro").replace("Comarca de ", "")}</span>, <span style={ph("vig_data")}>{v("vig_data")}</span>.</p>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,marginTop:60,textAlign:"center"}}>
        <div>
          <p style={{marginTop:40}}>___________________________________________</p>
          <p><b style={ph("pac_nome")}>{v("pac_nome")}</b></p>
          <p style={ph("pac_cpf")}>CPF: {v("pac_cpf")}</p>
          <p style={{fontWeight:600}}>CONTRATANTE</p>
        </div>
        <div>
          <p style={{marginTop:40}}>___________________________________________</p>
          <p><b style={ph("psi_nome")}>{v("psi_nome")}</b></p>
          <p style={ph("psi_crp")}>CRP: {v("psi_crp")}</p>
          <p style={{fontWeight:600}}>CONTRATADA</p>
        </div>
      </div>
    </>
  );
}

function ContractPaperContentMenor({ data }) {
  const d = { ...DEFAULT_DATA_MENOR, ...data };
  const v = (id) => d[id] || `[${id}]`;
  const empty = (id) => !data[id];
  const ph = (id) => empty(id) ? {color:"#94a3b8",fontStyle:"italic"} : {};
  const secStyle = {fontSize:"13pt",color:"#1a365d",borderBottom:"1pt solid #2b6cb0",paddingBottom:3,marginTop:18,marginBottom:8,fontWeight:700};

  return (
    <>
      <h1 style={{textAlign:"center",fontSize:"15pt",marginBottom:6,letterSpacing:.5}}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PSICOTERAPIA</h1>
      <p style={{textAlign:"center",fontSize:"12pt",marginBottom:20,color:"#475569"}}>(CRIANÇAS E ADOLESCENTES)</p>

      <h2 style={secStyle}>DAS PARTES</h2>

      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>
        <b>CONTRATANTE (RESPONSÁVEL LEGAL):</b> <span style={ph("resp_nome")}>{v("resp_nome")}</span>, <span style={ph("resp_nacionalidade")}>{v("resp_nacionalidade")}</span>, <span style={ph("resp_profissao")}>{v("resp_profissao")}</span>, inscrito(a) no CPF sob o nº <span style={ph("resp_cpf")}>{v("resp_cpf")}</span>, residente e domiciliado(a) no endereço <span style={ph("resp_endereco")}>{v("resp_endereco")}</span>, <span style={ph("resp_parentesco")}>{v("resp_parentesco")}</span> do(a) paciente, doravante denominado(a) CONTRATANTE.
      </p>

      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>
        <b>BENEFICIÁRIO(A) (PACIENTE):</b> <span style={ph("pac_nome")}>{v("pac_nome")}</span>, nascido(a) em <span style={ph("pac_nascimento")}>{v("pac_nascimento")}</span>, menor de idade, representado(a) neste ato por seu(sua) responsável legal acima qualificado(a).
      </p>

      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>
        <b>CONTRATADA:</b> <span style={ph("psi_nome")}>{v("psi_nome")}</span>, <span style={ph("psi_nacionalidade")}>{v("psi_nacionalidade")}</span>, Psicóloga, inscrita no Conselho Regional de Psicologia sob o CRP <span style={ph("psi_crp")}>{v("psi_crp")}</span>, inscrita no CPF sob o nº <span style={ph("psi_cpf")}>{v("psi_cpf")}</span>, com consultório situado na <span style={ph("psi_endereco")}>{v("psi_endereco")}</span>, doravante denominada CONTRATADA.
      </p>

      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>As partes acima identificadas celebram o presente contrato de prestação de serviços de psicoterapia para o(a) BENEFICIÁRIO(A), que será regido pelas cláusulas e condições a seguir:</p>

      <h2 id="clausula-m-1" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA PRIMEIRA — DO OBJETO</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>1.1. O presente contrato tem por objeto a prestação de serviços de <span style={ph("srv_modalidade")}>{v("srv_modalidade")}</span> pela CONTRATADA ao(à) BENEFICIÁRIO(A), em sessões individuais com duração de <span style={ph("srv_duracao")}>{v("srv_duracao")}</span>, com frequência de <span style={ph("srv_frequencia")}>{v("srv_frequencia")}</span>.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>1.2. O horário das sessões será <span style={ph("srv_horario")}>{v("srv_horario").toLowerCase()}</span>, em dia e horário fixo semanal, previamente combinado e reservado exclusivamente para o(a) BENEFICIÁRIO(A).</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>1.3. O acompanhamento psicológico é regido por princípios éticos, especialmente no que diz respeito ao sigilo profissional. Tudo o que é compartilhado em sessão pelo(a) BENEFICIÁRIO(A) é protegido por confidencialidade, conforme o Código de Ética Profissional do Psicólogo (Resolução CFP nº 010/2005) e o Estatuto da Criança e do Adolescente (Lei nº 8.069/1990).</p>

      <h2 id="clausula-m-2" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA SEGUNDA — DA REMUNERAÇÃO E FORMA DE PAGAMENTO</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>2.1. O(A) CONTRATANTE pagará à CONTRATADA o valor mensal de R$ <span style={ph("fin_mensal")}>{v("fin_mensal")}</span> ({valorPorExtenso(v("fin_mensal"))} reais), correspondente ao valor de R$ <span style={ph("fin_sessao")}>{v("fin_sessao")}</span> ({valorPorExtenso(v("fin_sessao"))} reais) por sessão, em regime de mensalidade.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>2.2. A mensalidade deverá ser paga <span style={ph("fin_vencimento")}>{v("fin_vencimento").toLowerCase()}</span>.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>2.3. A mensalidade contempla: a reserva e proteção do horário na agenda da CONTRATADA; a manutenção da clínica e do serviço; os encontros terapêuticos semanais; e o desenvolvimento contínuo e personalizado do acompanhamento.</p>

      <h2 id="clausula-m-3" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA TERCEIRA — DAS DESMARCAÇÕES E FALTAS</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>3.1. Quando o(a) CONTRATANTE desmarcar uma sessão do(a) BENEFICIÁRIO(A), a mensalidade é mantida, pois o horário segue reservado. A reposição pode ser combinada apenas se houver disponibilidade de agenda, não sendo garantida.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>3.2. Faltas sem aviso prévio de pelo menos 24 (vinte e quatro) horas de antecedência serão cobradas normalmente como sessão realizada.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>3.3. Faltas com aviso antecipado possibilitam a reposição da sessão na mesma semana, conforme disponibilidade de agenda.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>3.4. Quando a CONTRATADA desmarcar uma sessão, buscará oferecer reposição dentro do mesmo mês. Caso o(a) BENEFICIÁRIO(A) não possa comparecer ao horário proposto, o valor da sessão será descontado da mensalidade seguinte.</p>

      <h2 id="clausula-m-4" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA QUARTA — DOS MESES COM CINCO SEMANAS</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>4.1. A mensalidade refere-se ao período mensal de acompanhamento, independentemente de o mês ter quatro ou cinco semanas. Em meses com cinco semanas, a quinta sessão está garantida sem cobrança adicional, desde que haja disponibilidade de agenda. Essa sessão extra compensa os períodos de férias da CONTRATADA, durante os quais a mensalidade é mantida conforme previsto na Cláusula Quinta.</p>

      <h2 id="clausula-m-5" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA QUINTA — DOS FERIADOS E FÉRIAS</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>5.1. Sessões que coincidirem com feriados não são automaticamente repostas. Havendo disponibilidade de agenda, a reposição pode ser combinada.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>5.2. Férias ou viagens do(a) BENEFICIÁRIO(A) não suspendem a mensalidade, pois o horário e o espaço seguem reservados.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>5.3. A CONTRATADA poderá usufruir de até dois períodos de férias ao longo do ano, previamente comunicados ao(à) CONTRATANTE. As férias, contabilizando 30 dias, serão distribuídas em duas quinzenas em épocas distintas do ano. O valor da mensalidade será mantido durante as férias para a garantia da reserva do horário e manutenção dos serviços da clínica.</p>

      <h2 id="clausula-m-6" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA SEXTA — DA PAUSA OU INTERRUPÇÃO DO PROCESSO</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>6.1. Caso o(a) CONTRATANTE decida pausar ou interromper o acompanhamento do(a) BENEFICIÁRIO(A), é necessário comunicar com antecedência, preferencialmente em sessão.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>6.2. O valor da mensalidade referente ao mês em que a interrupção for avisada permanece devido, pois o horário e o espaço clínico já estavam reservados.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>6.3. Em caso de pausa, a vaga deixa de ser reservada e poderá ser disponibilizada para outra pessoa, não havendo garantia de manutenção do mesmo horário no retorno.</p>

      <h2 id="clausula-m-7" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA SÉTIMA — DAS REUNIÕES COM O(A) RESPONSÁVEL</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>7.1. A CONTRATADA poderá realizar reuniões eventuais com o(a) CONTRATANTE (responsável legal) para fornecer atualizações necessárias sobre o andamento do processo terapêutico do(a) BENEFICIÁRIO(A).</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>7.2. Tais reuniões terão caráter informativo e de orientação, preservando integralmente o sigilo sobre o conteúdo das sessões do(a) BENEFICIÁRIO(A). Serão compartilhadas apenas as informações estritamente necessárias ao acompanhamento e ao bem-estar do(a) menor, conforme o Código de Ética Profissional do Psicólogo e o Estatuto da Criança e do Adolescente.</p>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>7.3. O agendamento dessas reuniões será feito em comum acordo entre a CONTRATADA e o(a) CONTRATANTE, conforme a necessidade clínica avaliada pela CONTRATADA.</p>

      <h2 id="clausula-m-8" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA OITAVA — DA VIGÊNCIA</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>8.1. O presente contrato terá vigência de <span style={ph("vig_meses")}>{v("vig_meses")}</span> ({mesesPorExtenso(v("vig_meses"))}) meses, contados a partir da data de sua assinatura, podendo ser renovado por acordo entre as partes.</p>

      <h2 id="clausula-m-9" style={{...secStyle,scrollMarginTop:20}}>CLÁUSULA NONA — DO FORO</h2>
      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>9.1. As partes elegem o foro da <span style={ph("vig_foro")}>{v("vig_foro")}</span> para dirimir quaisquer dúvidas ou controvérsias oriundas do presente contrato, renunciando a qualquer outro, por mais privilegiado que seja.</p>

      <p style={{textAlign:"justify",margin:"6pt 0",lineHeight:1.7}}>E por estarem de acordo, as partes assinam o presente contrato em duas vias de igual teor e forma.</p>

      <p style={{textAlign:"center",marginTop:16}}><span style={ph("vig_foro")}>{v("vig_foro").replace("Comarca de ", "")}</span>, <span style={ph("vig_data")}>{v("vig_data")}</span>.</p>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,marginTop:60,textAlign:"center"}}>
        <div>
          <p style={{marginTop:40}}>___________________________________________</p>
          <p><b style={ph("resp_nome")}>{v("resp_nome")}</b></p>
          <p style={ph("resp_cpf")}>CPF: {v("resp_cpf")}</p>
          <p style={{fontWeight:600}}>CONTRATANTE (RESPONSÁVEL LEGAL)</p>
        </div>
        <div>
          <p style={{marginTop:40}}>___________________________________________</p>
          <p><b style={ph("psi_nome")}>{v("psi_nome")}</b></p>
          <p style={ph("psi_crp")}>CRP: {v("psi_crp")}</p>
          <p style={{fontWeight:600}}>CONTRATADA</p>
        </div>
      </div>
    </>
  );
}

function ContractEditor({ data, setData, fieldGroups, defaultData, PaperContent, onExportPDF, onExportDOCX, title, subtitle }) {
  const update = (id, val) => setData(prev => ({...prev, [id]: val}));

  return (
    <div className="fade-in contract-editor-layout" style={{display:"flex",height:"100%",overflow:"hidden"}}>
      {/* Left: Form Panel */}
      <div className="contract-form-panel" style={{width:380,minWidth:380,background:"#0f172a",borderRight:"1px solid #1e293b",overflowY:"auto",padding:"20px 18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <span style={{fontSize:28}}>📝</span>
          <div>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,color:"#f1f5f9"}}>{title}</h2>
            <p style={{fontSize:11,color:C.muted}}>{subtitle}</p>
          </div>
        </div>

        {fieldGroups.map((group, gi) => (
          <div key={gi}>
            <div style={{display:"flex",alignItems:"center",gap:8,margin:"18px 0 10px"}}>
              <span style={{fontSize:16}}>{group.icon}</span>
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1,color:C.accentBright,fontWeight:600}}>{group.title}</div>
            </div>
            {group.fields.map(f => (
              <Field key={f.id} field={f} value={data[f.id]} onChange={v=>update(f.id,v)} />
            ))}
          </div>
        ))}
      </div>

      {/* Right: Preview + Actions */}
      <div className="contract-preview-panel" style={{flex:1,overflowY:"auto",background:"#1a1f36",padding:30}}>
        <div className="contract-actions" style={{display:"flex",gap:10,marginBottom:20,justifyContent:"flex-end"}}>
          <ActionBtn label="📄 Gerar PDF" color="#0ea5e9" onClick={()=>onExportPDF({...defaultData,...data})} />
          <ActionBtn label="📝 Gerar DOCX" color={C.accent} onClick={()=>onExportDOCX({...defaultData,...data})} />
        </div>

        <div className="contract-paper" style={{background:"#fff",color:"#1e293b",maxWidth:680,margin:"0 auto",padding:"50px 48px",borderRadius:4,boxShadow:"0 4px 30px rgba(0,0,0,0.4)",fontFamily:"Arial,sans-serif",fontSize:"11pt",lineHeight:1.6,minHeight:600}}>
          <PaperContent data={data} />
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, open, onClick, small }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:open?(small?"6px 18px 6px 26px":"10px 18px"):"10px 0",
        background:active?"rgba(129,140,248,0.12)":hovered?"rgba(255,255,255,0.04)":"transparent",
        border:"none",borderLeft:active?`3px solid ${C.accent}`:"3px solid transparent",
        color:active?"#fff":hovered?"#cbd5e1":"#94a3b8",cursor:"pointer",fontSize:small?12.5:13,
        fontFamily:"'DM Sans',sans-serif",fontWeight:active?600:400,transition:"all .15s",textAlign:"left",
        justifyContent:open?"flex-start":"center"}}>
      <span style={{fontSize:small?14:16}}>{icon}</span>
      {open && <span style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{label}</span>}
    </button>
  );
}

/* ════════════════════════════════════════════
   MOBILE HEADER (visible only on small screens)
   ════════════════════════════════════════════ */
function MobileHeader({ view, setView, sidebarOpen, setSidebarOpen }) {
  return (
    <div className="mobile-header" style={{
      display:"none",
      alignItems:"center",
      justifyContent:"space-between",
      padding:"10px 16px",
      background:C.sidebar,
      borderBottom:"1px solid #1e293b",
    }}>
      <button onClick={()=>setSidebarOpen(!sidebarOpen)} style={{
        background:"transparent",border:"none",color:"#fff",fontSize:22,cursor:"pointer",padding:4,
      }}>☰</button>
      <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,color:"#fff"}}>
        <span style={{color:C.accent}}>Contrato</span> Terapêutico
      </div>
      <div style={{display:"flex",gap:4}}>
        <button onClick={()=>setView("contrato")} style={{
          background:view==="contrato"?C.accentDim:"transparent",
          border:"1px solid "+C.borderDark,borderRadius:6,color:"#fff",fontSize:12,padding:"4px 10px",cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif",
        }}>📝</button>
        <button onClick={()=>setView("contrato-menor")} style={{
          background:view==="contrato-menor"?C.accentDim:"transparent",
          border:"1px solid "+C.borderDark,borderRadius:6,color:"#fff",fontSize:12,padding:"4px 10px",cursor:"pointer",
          fontFamily:"'DM Sans',sans-serif",
        }}>🧒</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MOBILE SIDEBAR OVERLAY (visible only on small screens when open)
   ════════════════════════════════════════════ */
function MobileSidebarOverlay({ open, onClose, view, setView, onScrollTo }) {
  if (!open) return null;

  return (
    <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.6)"}} />
      <div style={{position:"relative",width:280,maxWidth:"80vw",background:`linear-gradient(180deg,${C.sidebar},#0B1120)`,overflowY:"auto",zIndex:1}}>
        <div style={{padding:"20px 18px",borderBottom:"1px solid #1e293b"}}>
          <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:16,color:"#fff",letterSpacing:-.3}}>
            <span style={{color:C.accent}}>Contrato</span> Terapêutico
          </div>
          <div style={{fontSize:10,color:C.muted,marginTop:2}}>Flávia Gonçalves Moreira</div>
        </div>
        <div style={{padding:"12px 0"}}>
          <SidebarItem icon="📝" label="Contrato Adulto" active={view==="contrato"} open={true}
            onClick={()=>{setView("contrato");onClose()}} />
          <SidebarItem icon="🧒" label="Contrato Crianças e Adolescentes" active={view==="contrato-menor"} open={true}
            onClick={()=>{setView("contrato-menor");onClose()}} />

          <div style={{height:1,background:"#1e293b",margin:"12px 16px"}} />

          <div style={{padding:"10px 18px 4px",fontSize:10,textTransform:"uppercase",letterSpacing:1.2,color:C.muted,fontWeight:600}}>
            Cláusulas do Contrato
          </div>
          {(view === "contrato-menor" ? CLAUSE_ITEMS_MENOR : CLAUSE_ITEMS).map((item, i) => (
            <SidebarItem key={i} icon={item.icon} label={item.label} active={false} open={true}
              onClick={()=>{onScrollTo(view === "contrato-menor" ? "contrato-menor" : "contrato",item.id);onClose()}} small />
          ))}

        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("contrato");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [data, setData] = useState({...DEFAULT_DATA});
  const [dataMenor, setDataMenor] = useState({...DEFAULT_DATA_MENOR});
  const [activeClause, setActiveClause] = useState(null);

  const handleScrollTo = useCallback((targetView, sectionId) => {
    if (view !== targetView) {
      setView(targetView);
      setTimeout(() => scrollToId(sectionId), 100);
    } else {
      scrollToId(sectionId);
    }

    setActiveClause(sectionId);
    setTimeout(() => setActiveClause(null), 1500);
  }, [view]);

  // Determine which clause items to show based on current view
  const currentClauseItems = view === "contrato-menor" ? CLAUSE_ITEMS_MENOR : CLAUSE_ITEMS;
  const currentClauseView = view === "contrato-menor" ? "contrato-menor" : "contrato";

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",background:C.bg,color:"#e2e8f0"}}>
      <style>{css}</style>

      {/* ── MOBILE HEADER ── */}
      <MobileHeader view={view} setView={setView} sidebarOpen={mobileSidebarOpen} setSidebarOpen={setMobileSidebarOpen} />
      <MobileSidebarOverlay open={mobileSidebarOpen} onClose={()=>setMobileSidebarOpen(false)} view={view} setView={setView} onScrollTo={handleScrollTo} />

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* ── SIDEBAR ── */}
        <div className="app-sidebar" style={{width:sidebarOpen?270:56,minWidth:sidebarOpen?270:56,background:`linear-gradient(180deg,${C.sidebar},#0B1120)`,borderRight:"1px solid #1e293b",display:"flex",flexDirection:"column",transition:"all .3s ease",overflow:"hidden"}}>
          {/* Logo */}
          <div style={{padding:sidebarOpen?"20px 18px":"20px 12px",borderBottom:"1px solid #1e293b",cursor:"pointer"}} onClick={()=>setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? (
              <div className="sidebar-expanded-only">
                <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:16,color:"#fff",letterSpacing:-.3}}>
                  <span style={{color:C.accent}}>Contrato</span> Terapêutico
                </div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>Flávia Gonçalves Moreira</div>
              </div>
            ) : (
              <div style={{fontSize:20,textAlign:"center",color:C.accent}}>Ψ</div>
            )}
          </div>

          {/* Nav */}
          <div style={{padding:"12px 0",flex:1,overflowY:"auto"}}>
            <SidebarItem icon="📝" label="Contrato Adulto" active={view==="contrato"} open={sidebarOpen} onClick={()=>setView("contrato")} />
            <SidebarItem icon="🧒" label="Contrato Crianças e Adolescentes" active={view==="contrato-menor"} open={sidebarOpen} onClick={()=>setView("contrato-menor")} />

            {sidebarOpen && <div className="sidebar-expanded-only" style={{height:1,background:"#1e293b",margin:"12px 16px"}} />}

            {sidebarOpen && (
              <div className="sidebar-expanded-only">
                <div style={{padding:"10px 18px 4px",fontSize:10,textTransform:"uppercase",letterSpacing:1.2,color:C.muted,fontWeight:600}}>
                  Cláusulas do Contrato
                </div>
                {currentClauseItems.map((item, i) => (
                  <SidebarItem key={i} icon={item.icon} label={item.label}
                    active={activeClause === item.id} open={sidebarOpen}
                    onClick={()=>handleScrollTo(currentClauseView, item.id)} small />
                ))}
              </div>
            )}

          </div>

          {/* Footer */}
          {sidebarOpen && (
            <div className="sidebar-expanded-only" style={{padding:"12px 18px",borderTop:"1px solid #1e293b",fontSize:10,color:C.muted}}>
              CRP 04/84615<br/>Código de Ética CFP
            </div>
          )}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {view === "contrato" && (
            <ContractEditor data={data} setData={setData}
              fieldGroups={FIELD_GROUPS} defaultData={DEFAULT_DATA}
              PaperContent={ContractPaperContent}
              onExportPDF={exportPDF} onExportDOCX={exportDOCX}
              title="Contrato Terapêutico" subtitle="Preencha os campos para gerar o documento" />
          )}

          {view === "contrato-menor" && (
            <ContractEditor data={dataMenor} setData={setDataMenor}
              fieldGroups={FIELD_GROUPS_MENOR} defaultData={DEFAULT_DATA_MENOR}
              PaperContent={ContractPaperContentMenor}
              onExportPDF={exportPDFMenor} onExportDOCX={exportDOCXMenor}
              title="Contrato — Crianças e Adolescentes" subtitle="Preencha os campos para gerar o documento" />
          )}

        </div>
      </div>
    </div>
  );
}
