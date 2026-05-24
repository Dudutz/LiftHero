# LiftHero

Aplicação web mobile-first para praticantes intermediários de musculação registrarem cargas, acompanharem evolução e visualizarem o progresso como uma jornada heroica.

## Objetivo

Resolver a dificuldade de acompanhar evolução de força quando os registros ficam espalhados em papel, notas do celular ou memória. O LiftHero mostra última carga, tendência, PRs, platôs e conquistas em uma interface simples para uso na academia.

## Tecnologias

- HTML5 semântico
- CSS3 mobile-first
- JavaScript Vanilla
- LocalStorage para persistência, encapsulado em uma camada local de dados
- Chart.js via CDN para gráfico de evolução
- Lista local de exercícios em JSON

## Funcionalidades

- Registro de missão com exercício, data, séries, repetições e carga.
- Cálculo automático de força/volume: `séries x repetições x carga`.
- Persistência no `LocalStorage`.
- Histórico com filtro por exercício.
- Gráfico de evolução por exercício.
- Detecção de PR por exercício.
- Alerta de platô após 3 semanas sem novo PR.
- Sequência de missões registradas.
- Hall de conquistas e níveis inspirados em heróis da Marvel e DC.
- Autocomplete tolerante a acentos.
- Botões principais com área mínima de 48px.

## Camada de dados local

O projeto não usa servidor externo. A pasta `js/` separa o front da persistência:

- `js/storage.js`: funciona como um backend local no navegador. Centraliza CRUD de treinos, catálogo de exercícios, persistência em `LocalStorage` e agrupamento por exercício.
- `js/app.js`: controla a interface, navegação, gráficos, cálculos de progresso e renderização.

Essa decisão garante funcionamento offline e evita expor chaves de API no front-end.

## Critérios da A3 atendidos

- Deploy estático pronto para GitHub Pages, Netlify ou Vercel.
- Tags Open Graph no `index.html`.
- Integração de dados com `LocalStorage`, arrays e JSON local.
- UX de espera no carregamento do gráfico.
- Layout mobile-first sem dependência de framework.
- Prevenção de erros com validação e controles `+`/`-`.
- Gamificação com níveis de heróis, PR Badge, conquistas e alerta temático.

## Escala de níveis

Ordem usada no app, do nível inicial ao mais forte:

1. Gavião Arqueiro - 0 kg
2. Batman - 5.000 kg
3. Capitão América - 15.000 kg
4. Homem-Aranha - 35.000 kg
5. Mulher-Maravilha - 75.000 kg
6. Superman - 150.000 kg

## Estrutura

```text
index.html
css/
  style.css
js/
  storage.js
  app.js
data/
  exercises.json
assets/
  og-lifthero.svg
```

## Como executar

Abra `index.html` no navegador ou publique a pasta em um serviço estático. Para testar o `fetch` do JSON local em alguns navegadores, use um servidor simples:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.
