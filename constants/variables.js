import classicCards from "../prompts/classic";
import boysCards from "../prompts/boys";
import girlsCards from "../prompts/girls";
import pregameCards from "../prompts/pregame";
import chaosCards from "../prompts/chaos";
import joy from "@/public/joy.json";
import meltingAnim from "@/public/melting.json";
import sunglassesFace from "@/public/sunglasses-face.json";
import winkyTongue from "@/public/winky-tongue.json";
import impSmile from "@/public/imp-smile.json";

export const Plans = [
  {
    title: "Monthly",
    price: 1.99,
    duration: "month",
    durationShort: "mo",
    id: "monthly",
  },
  {
    title: "Annual",
    price: 19.99,
    duration: "year",
    durationShort: "yr",
    id: "annual",
  },
];

export const standardStyles = {
  boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
  elevation: 10,
};

export const colors = {
  primary: "#ccccff",
  secondary: "#E32565",
  tertiary: "#3B99FB",
  lightblue: "#33DDFF",
  lightblack: "#121212",
};

export const CARD_TYPES = {
  INDIVIDUAL: "INDIVIDUAL",
  GROUP: "GROUP",
  HEAD_TO_HEAD: "HEAD_TO_HEAD",
  HEAD_TO_HEAD_PROCTORED: "HEAD_TO_HEAD_PROCTORED",
};

export const gameColors = [
  "#A17EA8",
  "#95C9C0",
  "#C7C09B",
  "#E9F0EE",
  "#C69DCF",
];

export const gameSettings = {
  never_have_i_ever: {
    header: "Never Have I Ever",
    color: "lightgreen",
    card_type: CARD_TYPES.GROUP,
  },
  most_likely_to: {
    header: "Who's Most Likely To",
    color: "#f15bb5",
    card_type: CARD_TYPES.GROUP,
  },
  categories: {
    header: "Categories",
    color: "orange",
    card_type: CARD_TYPES.GROUP,
  },
  this_or_that: {
    header: "This or That",
    color: "yellow",
    card_type: CARD_TYPES.GROUP,
  },
  do_or_drink: {
    header: "Do or Drink",
    color: colors.primary,
    card_type: CARD_TYPES.INDIVIDUAL,
  },
  do_and_drink: {
    header: "Do and Drink",
    color: colors.lightblue,
    card_type: CARD_TYPES.INDIVIDUAL,
  },
  rizztraining_order: {
    header: "Rizztraining Order",
    color: "#f79d65",
    card_type: CARD_TYPES.INDIVIDUAL,
  },
  red_flag_green_flag: {
    header: "Red Flag, Green Flag",
    color: "#adff02",
    card_type: CARD_TYPES.GROUP,
  },
  dumpable_offense: {
    header: "Dumpable Offense?",
    color: "#9b5de5",
    card_type: CARD_TYPES.GROUP,
  },
  wildcard: {
    header: "WILDCARD",
    color: colors.primary,
  },
};

export const packConfig = {
  classic: {
    id: "classic",
    title: "Classic",
    color: "#ff8800",
    img: joy,
    imgSpeed: 0.8,
    caption: "Start the night with games everyone knows and loves",
    includesHeader: "250 Cards Across 6 Games",
    paid: false,
    games: [
      gameSettings.never_have_i_ever,
      gameSettings.fact_or_fiction,
      gameSettings.most_likely_to,
      gameSettings.categories,
      gameSettings.this_or_that,
      gameSettings.fuck_marry_kill,
    ],
    cards: classicCards,
  },
  pre: {
    id: "pre",
    title: "Pregame",
    color: colors.secondary,
    img: meltingAnim,
    imgSpeed: 0.8,
    caption: "Go from 0 to 60 fast for the perfect power hour",
    paid: true,
    games: [gameSettings.chug_if],
    standard: true,
    cards: pregameCards,
  },
  guys: {
    id: "guys",
    title: "Guy's Night",
    color: "#ff0000",
    img: sunglassesFace,
    imgSpeed: 0.7,
    caption: "Grab the boys, it's time for a bro-down",
    paid: true,
    games: [gameSettings.rizztraining_order, gameSettings.red_flag_green_flag],
    standard: true,
    cards: boysCards,
  },
  gals: {
    id: "gals",
    title: "Gal's Night",
    color: "#8338ec",
    img: winkyTongue,
    imgSpeed: 0.7,
    caption: "From icks to dick pics, this was built for the ladies",
    paid: true,
    games: [gameSettings.thats_an_ick, gameSettings.iykyk],
    standard: true,
    cards: girlsCards,
  },
  chaos: {
    id: "chaos",
    title: "Chaos",
    color: colors.lightblack,
    img: impSmile,
    imgSpeed: 1,
    caption: "Not meant for the faint of heart",
    paid: true,
    games: [],
    standard: true,
    cards: chaosCards,
  },
};

// date: {
//   title: "Date Night",
//   img: require('./assets/kissing-heart.json'),
//   caption: "Start the night with games proven to cause a good time",
//   paid: true,
//   games: [ "all 6 classic games", "touch test", "confessions", "you should know this" ]
// },
// after: {
//   title: "After Party",
//   img: require('./assets/woozy.json'),
//   caption: "You're already drunk, now let's keep the night alive",
//   paid: true,
//   games: [ "all 6 classic games", "sobriety check", "guess the lyric", "rhyme" ]
// },
