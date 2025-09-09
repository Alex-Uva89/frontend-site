// venues.ts (o .js)

import casa    from '/src/assets/casa.jpg'
import cucina  from '/src/assets/cucina.jpg'
import cucina2 from '/src/assets/cucina2.jpg'
import enoteca from '/src/assets/enoteca.jpg'
import piatto1 from '/src/assets/piatto1.jpg'
import piatto2 from '/src/assets/piatto2.jpg'

export const venues = [
  {
    id: 'osteria',
    name: 'Mamma Elvira Osteria',
    kind: 'osteria',
    address: 'Lecce',
    image: 'https://picsum.photos/seed/osteria/800/600',
    bookingUrl: 'https://prenota.example/osteria',
    coords: { lng: 18.17162, lat: 40.35241 },
    menuUrl: '#',
    gallery: [
      { src: casa,    alt: 'Osteria • Sala 1' },
      { src: cucina,  alt: 'Osteria • Dettaglio tavolo' },
      { src: cucina2, alt: 'Osteria • Piatto 1' },
      { src: enoteca, alt: 'Osteria • Piatto 2' },
      { src: piatto1, alt: 'Osteria • Vini' },
      { src: piatto2, alt: 'Osteria • Esterno' }
    ],
    hours: [
      [ { o: '12:30', c: '15:00' }, { o: '19:30', c: '23:30' } ], // Lun
      [],                                                         // Mar (chiuso)
      [ { o: '12:30', c: '15:00' }, { o: '19:30', c: '23:30' } ], // Mer
      [ { o: '12:30', c: '15:00' }, { o: '19:30', c: '23:30' } ], // Gio
      [ { o: '12:30', c: '15:00' }, { o: '19:30', c: '00:00' } ], // Ven
      [ { o: '12:30', c: '15:30' }, { o: '19:00', c: '00:00' } ], // Sab
      [ { o: '12:30', c: '15:30' }, { o: '19:00', c: '23:30' } ]  // Dom
    ],
    emotion: {
      tagline: 'Calore salentino, semplicità radicale.',
      body: 'Pane caldo, sughi lenti, vini di piccoli vignaioli. A tavola si sta stretti, vicini: è qui che la cucina diventa casa.',
      quote: { text: 'Il sapore migliore è quello condiviso.', author: 'Mamma Elvira' },
      images: [
        'https://picsum.photos/seed/osteria-em1/1200/1600',
        'https://picsum.photos/seed/osteria-em2/1600/1200',
        'https://picsum.photos/seed/osteria-em3/1200/1200'
      ],
      highlights: [
        { label: 'Pasta fresca', desc: 'Tirata a mano ogni mattina' },
        { label: 'Cantina', desc: 'Solo artigiani indipendenti' },
        { label: 'Pane', desc: 'Lievito madre, forno vivo' }
      ]
    }
  },
  {
    id: 'ristorante',
    name: 'Mamma Elvira Ristorante',
    kind: 'ristorante',
    address: 'Lecce',
    image: 'https://picsum.photos/seed/ristorante/800/600',
    bookingUrl: 'https://prenota.example/ristorante',
    coords: { lng: 18.17040, lat: 40.35302 },
    menuUrl: '#',
    gallery: [
      { src: casa,    alt: 'Osteria • Sala 1' },
      { src: cucina,  alt: 'Osteria • Dettaglio tavolo' },
      { src: cucina2, alt: 'Osteria • Piatto 1' },
      { src: enoteca, alt: 'Osteria • Piatto 2' },
      { src: piatto1, alt: 'Osteria • Vini' },
      { src: piatto2, alt: 'Osteria • Esterno' }
    ],
    hours: [
      [ { o: '19:30', c: '23:30' } ],                            // Lun (aperto cena)
      [],                                                        // Mar (chiuso)
      [ { o: '19:30', c: '23:30' } ],                            // Mer
      [ { o: '19:30', c: '23:30' } ],                            // Gio
      [ { o: '19:30', c: '00:00' } ],                            // Ven
      [ { o: '12:30', c: '15:00' }, { o: '19:30', c: '00:00' } ],// Sab
      [ { o: '12:30', c: '15:00' }, { o: '19:00', c: '23:30' } ] // Dom
    ],
    emotion: {
      tagline: 'Tecnica e memoria, nel piatto.',
      body: 'Ingredienti nudi, gesti precisi, stagioni che scandiscono il menu. La cucina parla piano: ascoltala.',
      quote: { text: 'Eleganza è togliere, non aggiungere.', author: 'La Brigata' },
      images: [
        'https://picsum.photos/seed/ristorante-em1/1600/1200',
        'https://picsum.photos/seed/ristorante-em2/1200/1600',
        'https://picsum.photos/seed/ristorante-em3/1400/1400'
      ],
      highlights: [
        { label: 'Degustazione', desc: 'Percorsi in 5 o 7 portate' },
        { label: 'Cantina', desc: 'Vecchie annate e verticali' },
        { label: 'Stagioni', desc: 'Menu che cambiano davvero' }
      ]
    }
  },
  {
    id: 'pizzeria',
    name: 'Mamma Elvira Pizzeria',
    kind: 'pizzeria',
    address: 'Lecce',
    image: 'https://picsum.photos/seed/pizzeria/800/600',
    bookingUrl: 'https://prenota.example/pizzeria',
    coords: { lng: 18.17238, lat: 40.35202 },
    menuUrl: '#',
    gallery: [
      { src: casa,    alt: 'Osteria • Sala 1' },
      { src: cucina,  alt: 'Osteria • Dettaglio tavolo' },
      { src: cucina2, alt: 'Osteria • Piatto 1' },
      { src: enoteca, alt: 'Osteria • Piatto 2' },
      { src: piatto1, alt: 'Osteria • Vini' },
      { src: piatto2, alt: 'Osteria • Esterno' }
    ],
    hours: [
      [ { o: '18:30', c: '00:30' } ], // Lun
      [],                             // Mar (chiuso)
      [ { o: '18:30', c: '00:30' } ], // Mer
      [ { o: '18:30', c: '00:30' } ], // Gio
      [ { o: '18:30', c: '01:00' } ], // Ven
      [ { o: '18:30', c: '01:00' } ], // Sab
      [ { o: '18:00', c: '00:00' } ]  // Dom
    ],
    emotion: {
      tagline: 'Fermenti vivi, forno vivo.',
      body: 'Impasti maturi a lungo, pomodori veri, mozzarella fresca. Una pizza che profuma di legna e campagna.',
      quote: { text: 'La crosta racconta la cottura.', author: 'Il Pizzaiolo' },
      images: [
        'https://picsum.photos/seed/pizzeria-em1/1600/1200',
        'https://picsum.photos/seed/pizzeria-em2/1200/1600',
        'https://picsum.photos/seed/pizzeria-em3/1400/1400'
      ],
      highlights: [
        { label: 'Lievito madre', desc: 'Impasto 48h' },
        { label: 'Forno', desc: 'Cottura a fiamma' },
        { label: 'Pomodoro', desc: 'Selezione in origine' }
      ]
    }
  },
  {
    id: 'enoteca',
    name: 'Mamma Elvira Enoteca',
    kind: 'enoteca',
    address: 'Lecce',
    image: 'https://picsum.photos/seed/enoteca/800/600',
    bookingUrl: 'https://prenota.example/enoteca',
    coords: { lng: 18.16908, lat: 40.35386 },
    menuUrl: '#',
    gallery: [
      { src: casa,    alt: 'Osteria • Sala 1' },
      { src: cucina,  alt: 'Osteria • Dettaglio tavolo' },
      { src: cucina2, alt: 'Osteria • Piatto 1' },
      { src: enoteca, alt: 'Osteria • Piatto 2' },
      { src: piatto1, alt: 'Osteria • Vini' },
      { src: piatto2, alt: 'Osteria • Esterno' }
    ],
    hours: [
      [ { o: '18:00', c: '01:00' } ], // Lun
      [],                             // Mar (chiuso)
      [ { o: '18:00', c: '01:00' } ], // Mer
      [ { o: '18:00', c: '01:00' } ], // Gio
      [ { o: '18:00', c: '02:00' } ], // Ven
      [ { o: '18:00', c: '02:00' } ], // Sab
      [ { o: '18:00', c: '00:00' } ]  // Dom
    ],
    emotion: {
      tagline: 'Bottiglie che sussurrano storie.',
      body: 'Vini artigiani, bicchieri generosi, tavoli vicini. Stappiamo, raccontiamo, condividiamo.',
      quote: { text: 'Il vino è memoria liquida.', author: 'La Cantina' },
      images: [
        'https://picsum.photos/seed/enoteca-em1/1600/1200',
        'https://picsum.photos/seed/enoteca-em2/1200/1600',
        'https://picsum.photos/seed/enoteca-em3/1400/1400'
      ],
      highlights: [
        { label: 'Naturali', desc: 'Solo produttori indipendenti' },
        { label: 'Carta viva', desc: 'Rotazione settimanale' },
        { label: 'Taglieri', desc: 'Selezione salumi & formaggi' }
      ]
    }
  },
  {
    id: 'bnb',
    name: 'Mamma Elvira B&B',
    kind: 'b&b',
    address: 'Lecce',
    image: 'https://picsum.photos/seed/bnb/800/600',
    bookingUrl: 'https://prenota.example/bnb',
    coords: { lng: 18.17305, lat: 40.35166 },
    menuUrl: '#',
    gallery: [
      { src: casa,    alt: 'Osteria • Sala 1' },
      { src: cucina,  alt: 'Osteria • Dettaglio tavolo' },
      { src: cucina2, alt: 'Osteria • Piatto 1' },
      { src: enoteca, alt: 'Osteria • Piatto 2' },
      { src: piatto1, alt: 'Osteria • Vini' },
      { src: piatto2, alt: 'Osteria • Esterno' }
    ],
    hours: [
      '24h', // Lun
      [],    // Mar (chiuso)
      '24h', // Mer
      '24h', // Gio
      '24h', // Ven
      '24h', // Sab
      '24h'  // Dom
    ],
    emotion: {
      tagline: 'Accoglienza discreta, luce del mattino.',
      body: 'Pietra leccese, lenzuola fresche, caffè lento. Il Salento comincia qui, piano.',
      quote: { text: 'Il riposo è parte del viaggio.', author: 'La Casa' },
      images: [
        'https://picsum.photos/seed/bnb-em1/1600/1200',
        'https://picsum.photos/seed/bnb-em2/1200/1600',
        'https://picsum.photos/seed/bnb-em3/1400/1400'
      ],
      highlights: [
        { label: 'Colazione', desc: 'Prodotti del territorio' },
        { label: 'Silenzio', desc: 'Camere interne luminose' },
        { label: 'Consigli', desc: 'Itinerari su misura' }
      ]
    }
  }
]
