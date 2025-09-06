export const venues = [
  {
    id: 'osteria',
    name: 'Mamma Elvira Osteria',
    kind: 'osteria',
    address: 'Lecce',
    image: 'https://picsum.photos/seed/osteria/800/600',
    bookingUrl: 'https://prenota.example/osteria',
    menuUrl: '#',
    gallery: [
      { src: 'https://picsum.photos/seed/osteria-1/1920/1080', alt: 'Osteria • Sala 1' },
      { src: 'https://picsum.photos/seed/osteria-2/1920/1080', alt: 'Osteria • Dettaglio tavolo' },
      { src: 'https://picsum.photos/seed/osteria-3/1920/1080', alt: 'Osteria • Piatto 1' },
      { src: 'https://picsum.photos/seed/osteria-4/1920/1080', alt: 'Osteria • Piatto 2' },
      { src: 'https://picsum.photos/seed/osteria-5/1920/1080', alt: 'Osteria • Vini' },
      { src: 'https://picsum.photos/seed/osteria-6/1920/1080', alt: 'Osteria • Esterno' }
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
    menuUrl: '#',
    gallery: [
      { src: 'https://picsum.photos/seed/ristorante-1/1920/1080', alt: 'Ristorante • Sala 1' },
      { src: 'https://picsum.photos/seed/ristorante-2/1920/1080', alt: 'Ristorante • Chef al pass' },
      { src: 'https://picsum.photos/seed/ristorante-3/1920/1080', alt: 'Ristorante • Piatto 1' },
      { src: 'https://picsum.photos/seed/ristorante-4/1920/1080', alt: 'Ristorante • Piatto 2' },
      { src: 'https://picsum.photos/seed/ristorante-5/1920/1080', alt: 'Ristorante • Cantina' },
      { src: 'https://picsum.photos/seed/ristorante-6/1920/1080', alt: 'Ristorante • Esterno' }
    ],
    hours: [
      [ { o: '19:30', c: '23:30' } ],                           // Lun (aperto cena)
      [],                                                       // Mar (chiuso)
      [ { o: '19:30', c: '23:30' } ],                           // Mer
      [ { o: '19:30', c: '23:30' } ],                           // Gio
      [ { o: '19:30', c: '00:00' } ],                           // Ven
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
    menuUrl: '#',
    gallery: [
      { src: 'https://picsum.photos/seed/pizzeria-1/1920/1080', alt: 'Pizzeria • Forno' },
      { src: 'https://picsum.photos/seed/pizzeria-2/1920/1080', alt: 'Pizzeria • Sala' },
      { src: 'https://picsum.photos/seed/pizzeria-3/1920/1080', alt: 'Pizzeria • Pizza 1' },
      { src: 'https://picsum.photos/seed/pizzeria-4/1920/1080', alt: 'Pizzeria • Pizza 2' },
      { src: 'https://picsum.photos/seed/pizzeria-5/1920/1080', alt: 'Pizzeria • Dettaglio' },
      { src: 'https://picsum.photos/seed/pizzeria-6/1920/1080', alt: 'Pizzeria • Esterno' }
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
    menuUrl: '#',
    gallery: [
      { src: 'https://picsum.photos/seed/enoteca-1/1920/1080', alt: 'Enoteca • Scaffali' },
      { src: 'https://picsum.photos/seed/enoteca-2/1920/1080', alt: 'Enoteca • Degustazione' },
      { src: 'https://picsum.photos/seed/enoteca-3/1920/1080', alt: 'Enoteca • Calici' },
      { src: 'https://picsum.photos/seed/enoteca-4/1920/1080', alt: 'Enoteca • Salumi e formaggi' },
      { src: 'https://picsum.photos/seed/enoteca-5/1920/1080', alt: 'Enoteca • Dettaglio bottiglie' },
      { src: 'https://picsum.photos/seed/enoteca-6/1920/1080', alt: 'Enoteca • Esterno' }
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
    menuUrl: '#',
    gallery: [
      { src: 'https://picsum.photos/seed/bnb-1/1920/1080', alt: 'B&B • Camera 1' },
      { src: 'https://picsum.photos/seed/bnb-2/1920/1080', alt: 'B&B • Camera 2' },
      { src: 'https://picsum.photos/seed/bnb-3/1920/1080', alt: 'B&B • Colazione' },
      { src: 'https://picsum.photos/seed/bnb-4/1920/1080', alt: 'B&B • Dettagli' },
      { src: 'https://picsum.photos/seed/bnb-5/1920/1080', alt: 'B&B • Cortile' },
      { src: 'https://picsum.photos/seed/bnb-6/1920/1080', alt: 'B&B • Esterno' }
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
