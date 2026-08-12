// Edit this file to change event details or the RSVP endpoint.
// No other file needs to change for those updates.

const CONFIG = {
  // Paste the "Web app URL" you get after deploying a Google Apps Script
  // web app bound to a fresh Google Sheet (same process as the godparent
  // site's rsvp-backend/README.md). Leave blank to disable RSVP recording.
  rsvpEndpoint: '',

  // Path/URL to a background music track (mp3). Starts on the "Open Invitation"
  // tap and loops with a small mute button. Leave blank to disable.
  backgroundMusicUrl: 'assets/musicinmedia-piano-for-babies-60-seconds-359367.mp3',

  event: {
    childName: 'John Eli Sebastian',
    eventDate: 'September 5, 2026',
    accentColor: '#5A7B99',
    dressCode: 'We kindly encourage all guest to come in comfortable casual outfits.',
    colorCodes: [
      { label: 'Light Blue',   img: 'assets/color-light-blue.png' },
      { label: 'White',        img: 'assets/color-white.png' },
      { label: 'Dirty White',  img: 'assets/color-dirty-white.png' },
      { label: 'Powder Blue',  img: 'assets/color-powder-blue.png' },
    ],
    reception: {
      time: '11:00 AM - 3:00 PM',
      name: "Lola Feling's Restaurant",
      logo: 'assets/restaurant-logo.png',
      note: "Your presence means the world to us, see you at the reception!",
    },
  },

  giftIdeas: [
    { label: 'Millie Moon Diapers',      img: 'assets/gift-diapers.png' },
    { label: 'Monetary Gift',            img: 'assets/gift-monetary.png' },
    { label: 'Clothes',                  img: 'assets/gift-clothes.png' },
    { label: 'Wet Wipes (Moose Gear)',   img: 'assets/gift-wipes.png' },
    { label: 'LOVE',                     img: 'assets/gift-love.png' },
    { label: 'Toddler Toys',             img: 'assets/gift-toys.jpg' },
  ],
};
