# Studialo

Gli appunti, finalmente chiari. Sito statico in Next.js pubblicato su [studialo.it](https://studialo.it).

## Aggiungere appunti (senza terminale)

Tutto si fa dal sito di GitHub. Ogni modifica salvata su `main` fa ripartire il deploy su Vercel.

### Nuovo argomento

1. Apri la cartella della materia, ad esempio `content/diritto-privato/`.
2. Clicca **Add file → Create new file**.
3. Chiamalo con un numero davanti per l'ordine: `03-contratto.mdx`.
   L'indirizzo sarà `studialo.it/diritto-privato/contratto` (il numero non compare).
4. Inizia il file così:

```mdx
---
title: Il contratto
description: Una frase che riassume l'argomento.
updated: 2026-10-07
---

Testo introduttivo.

## Primo paragrafo

Testo in **grassetto**, *corsivo*, elenchi, tabelle…
```

5. Clicca **Commit changes**. Dopo un paio di minuti è online.

Campi facoltativi: `order: 3` (ordine manuale) e `draft: true` (nasconde l'argomento).

### Nuova materia

Crea il file `content/nome-materia/_materia.md`:

```md
---
title: Diritto Commerciale
description: Una frase sulla materia.
order: 3
---
```

Poi aggiungi gli argomenti nella stessa cartella. Senza `_materia.md` il nome viene preso dalla cartella.

### Riquadri speciali

```mdx
<Definizione>Testo della definizione.</Definizione>
<Nota>Un'osservazione utile.</Nota>
<Esempio>Un caso concreto.</Esempio>
<Attenzione>Un errore da evitare.</Attenzione>
<Nota title="Titolo personalizzato">Testo.</Nota>
```

I titoli `##` e `###` finiscono da soli nell'indice "In questa pagina".

> In MDX i caratteri `<` e `{` hanno un significato speciale. Se ti servono nel testo, scrivi `\<` e `\{`.

## Deploy su Vercel

1. Su [vercel.com](https://vercel.com) → **Add New → Project** → importa questo repository.
2. Lascia le impostazioni proposte (framework Next.js) e clicca **Deploy**.
3. In **Settings → Domains** aggiungi `studialo.it` e segui le istruzioni DNS.

## Struttura

```
content/[materia]/[NN-capitolo].mdx   appunti
app/                                  pagine
components/                           interfaccia
lib/content.ts                        lettura dei contenuti
lib/site.ts                           nome, slogan, dominio
```
