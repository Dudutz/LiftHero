# LiftHero — Status do Projeto

## Status Geral
🟡 Em desenvolvimento

**Entrega do material:** a definir
**Apresentação ao vivo:** a definir

---

## Última Atualização
📅 24/05/2026
> Protótipo do Figma analisado e convertido para uma implementação estática em HTML, CSS e JavaScript Vanilla dentro da pasta `LiftHero`. A versão atual já possui camada local de dados com LocalStorage, registro de missão, histórico, evolução, níveis heroicos e conquistas.

---

## Visão do Produto

**O que é:** Aplicação web de rastreamento de evolução de cargas para praticantes intermediários de musculação.

**Problema:** Praticantes intermediários não conseguem visualizar se estão ficando mais fortes. Registros dispersos em papel ou notas de celular, sem tendência visível, sem alerta de platô.

**Persona:** João Vítor, 22 anos. Treina 4× por semana, anota o peso no celular mas nunca revisita os dados. Usa smartphone na academia e desktop para análise.

**Diferencial:** "Conquistas Épicas" — volume acumulado traduzido em referências do mundo real com linguagem heroica. Nenhum concorrente direto (Hevy, Strong, FitNotes) tem feature equivalente.

---

## Decisões Técnicas

| Camada | Decisão |
|---|---|
| Frontend | HTML5, CSS3, JavaScript Vanilla — sem frameworks |
| Persistência | LocalStorage — sem backend |
| API de exercícios | ExerciseDB via RapidAPI (plano gratuito) |
| Fallback da API | Lista local em JSON com exercícios comuns |
| Gráficos | Chart.js via CDN |
| Heatmap de frequência | cal-heatmap (vanilla JS, sem build tools) — candidato |
| Layout | CSS Flexbox + Media Queries, Mobile First |
| Deploy | a definir (Vercel, Netlify ou GitHub Pages) |
| Repositório | GitHub (a criar) |

**Estrutura de pastas atual:**
```
index.html
css/
  style.css
js/
  storage.js
  app.js
assets/
  og-lifthero.svg
data/
  exercises.json
```

---

## Decisões de Design e Gamificação

**Sistema:** "Origem do Herói" — o usuário começa em um nível de herói mais humano e evolui conforme treina, bate recordes e mantém frequência. A versão atual usa nomes reais de heróis Marvel/DC na escala de força.

**Elementos do sistema:**
- **Progressão de identidade** — título e emblema mudam conforme o usuário evolui
- **PR Badge** — destaque visual imediato ao bater recorde pessoal em qualquer exercício
- **Alerta de platô** — detecção automática de 3 semanas sem PR, com aviso temático
- **Streak** — contador de dias consecutivos de treino registrado
- **Conquistas Épicas** — volume acumulado comparado a referências do mundo real com linguagem heroica

**Escala atual de níveis:**
1. Gavião Arqueiro — 0 kg
2. Batman — 5.000 kg
3. Capitão América — 15.000 kg
4. Homem-Aranha — 35.000 kg
5. Mulher-Maravilha — 75.000 kg
6. Superman — 150.000 kg

**Referência de UX:**
- Hevy: benchmark para log de treino e gráficos de progressão
- Duolingo: streak e feedback de recompensa
- GitHub Contribution Heatmap: visualização de frequência (candidato: `cal-heatmap`)

---

## Funcionalidades

### Core
- [x] Registro de treino (exercício, série, repetições, carga)
- [x] Histórico de treinos por data
- [x] Gráfico de evolução de carga por exercício (Chart.js via CDN)
- [x] Autocomplete de exercícios com fallback JSON local
- [x] Persistência via LocalStorage com camada local de dados

### Gamificação
- [x] Sistema de progressão de herói (níveis com título e emblema)
- [x] PR Badge — destaque visual ao bater recorde
- [x] Alerta de platô — sem PR em 3 semanas
- [x] Streak — sequência de dias de treino
- [x] Conquistas Épicas — marcos de volume com referências reais

### Qualidade / Avaliação
- [x] Tags Open Graph no `<head>`
- [x] Spinner de loading no gráfico
- [x] Tratamento silencioso de erro no JSON local
- [x] Touch targets mínimos de 48px
- [x] Sem scroll horizontal em mobile
- [ ] Lighthouse > 90 em Acessibilidade

---

## Critérios de Avaliação

| # | Critério | Peso | Status |
|---|---|---|---|
| 1 | Deploy público (Vercel/Netlify/GitHub Pages) | 1,0 pt | ⬜ Pendente |
| 2 | Tags Open Graph no `<head>` | 1,0 pt | ✅ Feito |
| 3 | Repositório GitHub com README estruturado | 1,0 pt | 🟡 README feito; falta GitHub |
| 4 | Integração de API ou LocalStorage com arrays | 2,0 pts | ✅ Feito |
| 5 | Spinner de loading + tratamento silencioso de erro | 2,0 pts | ✅ Feito |
| 6 | Layout Mobile First, sem scroll horizontal | 2,0 pts | 🟡 Implementado; falta teste visual final |
| 7 | Touch targets mínimos de 48px (Lei de Fitts) | 2,0 pts | ✅ Feito |
| 8 | Prevenção de erros (botões +/-, tolerância a digitação) | 2,0 pts | ✅ Feito |
| 9 | Lighthouse > 90 em Acessibilidade | 2,0 pts | ⬜ Pendente |
| 10 | Gamificação real: níveis, badges, feedback visual | 2,0 pts | ✅ Feito |

---

## O que já está feito

- [x] Documento de Concepção Técnica (v1.0) entregue ao professor
- [x] Problema, persona e stack definidos
- [x] Mecânica de gamificação definida ("Origem do Herói")
- [x] Análise de concorrentes realizada (Hevy, Strong, FitNotes, Duolingo, Strava)
- [x] Protótipo de alta fidelidade recebido do Figma
- [x] Implementação HTML/CSS/JS Vanilla criada na raiz do projeto

---

## Próximos Passos

- [ ] Criar repositório GitHub
- [ ] Definir data de entrega e apresentação
- [x] Montar protótipo no Figma (ou rascunho em papel) — Mobile First
- [x] Estrutura base do projeto (pastas e arquivos)
- [x] Implementar registro de treino com LocalStorage
- [x] Implementar gráfico Chart.js
- [ ] Testar no navegador em mobile e desktop
- [ ] Rodar Lighthouse e salvar print da nota > 90
- [ ] Fazer deploy público
- [ ] Criar relatório P&D em PDF com evidências

---

## Histórico de Alterações

| Data | Hora | Alteração | Autor |
|---|---|---|---|
| 07/05/2026 | 19:30 | Arquivo de status criado; concepção do projeto consolidada; estrutura de pastas definida; cal-heatmap adicionado como candidato | João |
| 24/05/2026 | 00:00 | Protótipo do Figma analisado; versão HTML/CSS/JS Vanilla criada com LocalStorage, gamificação, histórico, evolução e README | Codex |
| 24/05/2026 | 00:00 | Projeto reorganizado na pasta LiftHero; camada local `storage.js` criada para separar persistência e front-end | Codex |

---

## Dúvidas em Aberto
*(registrar aqui dúvidas que surgirem durante o desenvolvimento)*
