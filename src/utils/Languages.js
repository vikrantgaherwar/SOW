const languages = [
  { value: "af", name: "Afrikaans" },
  { value: "sq", name: "Albanian" },
  { value: "bg", name: "Bulgarian" },
  { value: "zh-cn", name: "Chinese" },
  { value: "so", name: "Congo" },
  { value: "hr", name: "Croatian" },
  { value: "cs", name: "Czech" },
  { value: "da", name: "Danish" },
  { value: "nl", name: "Dutch" },
  { value: "en", name: "English" },
  { value: "et", name: "Estonian" },
  { value: "fi", name: "Finnish" },
  { value: "fr", name: "French" },
  { value: "de", name: "German" },
  { value: "he", name: "Hebrew" },
  { value: "hu", name: "Hungarian" },
  { value: "id", name: "Indonesian" },
  { value: "it", name: "Italian" },
  { value: "ja", name: "Japanese" },
  { value: "ko", name: "Korean" },
  { value: "lv", name: "Latvian" },
  { value: "lt", name: "Lithuanian" },
  { value: "bn", name: "Malay" },
  { value: "no", name: "Norwegian" },
  { value: "pl", name: "Polish" },
  { value: "pt", name: "Portugese" },
  { value: "ro", name: "Romanian" },
  { value: "ru", name: "Russian" },
  { value: "sk", name: "Slovakian" },
  { value: "sl", name: "Slovenian" },
  { value: "es", name: "Spanish" },
  { value: "sw", name: "Swahili" },
  { value: "sv", name: "Swedish" },
  { value: "tl", name: "Tagalog" },
  { value: "zh-tw", name: "Taiwanese" },
  { value: "th", name: "Thai" },
  { value: "tr", name: "Turkish" },
  { value: "uk", name: "Ukrainian" },
  { value: "vi", name: "Vietnamese" },
];
const GoogleTranslatedLanguages = 
[
//{value:"af", name:"Afrikaans"},
//{value:"sq", name:"Albanian"},
//{value:"am", name:"Amharic"},
//{value:"ar", name:"Arabic"},
//{value:"hy", name:"Armenian"},
//{value:"az", name:"Azerbaijani"},
//{value:"eu", name:"Basque"},
//{value:"be", name:"Belarusian"},
//{value:"bn", name:"Bengali"},
//{value:"bs", name:"Bosnian"},
//{value:"bg", name:"Bulgarian"},
//{value:"ca", name:"Catalan"},
//{value:"ceb", name:"Cebuano"},
//{value:"ny", name:"Chichewa"},
{value:"zh-CN", name:"Chinese (Simplified)"},
{value:"zh-TW", name:"Chinese (Traditional)"},
//{value:"co", name:"Corsican"},
//{value:"hr", name:"Croatian"},
//{value:"cs", name:"Czech"},
//{value:"da", name:"Danish"},
//{value:"nl", name:"Dutch"},
{value:"en", name:"English"},
//{value:"eo", name:"Esperanto"},
//{value:"et", name:"Estonian"},
//{value:"tl", name:"Filipino"},
//{value:"fi", name:"Finnish"},
{value:"fr", name:"French"},
//{value:"fy", name:"Frisian"},
//{value:"gl", name:"Galician"},
//{value:"ka", name:"Georgian"},
{value:"de", name:"German"},
//{value:"el", name:"Greek"},
//{value:"gu", name:"Gujarati"},
//{value:"ht", name:"Haitian Creole"},
//{value:"ha", name:"Hausa"},
//{value:"haw", name:"Hawaiian"},
//{value:"iw", name:"Hebrew"},
//{value:"hi", name:"Hindi"},
//{value:"hmn", name:"Hmong"},
//{value:"hu", name:"Hungarian"},
//{value:"is", name:"Icelandic"},
//{value:"ig", name:"Igbo"},
//{value:"id", name:"Indonesian"},
//{value:"ga", name:"Irish"},
{value:"it", name:"Italian"},
{value:"ja", name:"Japanese"},
//{value:"jw", name:"Javanese"},
//{value:"kn", name:"Kannada"},
//{value:"kk", name:"Kazakh"},
//{value:"km", name:"Khmer"},
//{value:"rw", name:"Kinyarwanda"},
{value:"ko", name:"Korean"},
//{value:"ku", name:"Kurdish (Kurmanji)"},
//{value:"ky", name:"Kyrgyz"},
//{value:"lo", name:"Lao"},
//{value:"la", name:"Latin"},
//{value:"lv", name:"Latvian"},
//{value:"lt", name:"Lithuanian"},
//{value:"lb", name:"Luxembourgish"},
//{value:"mk", name:"Macedonian"},
//{value:"mg", name:"Malagasy"},
//{value:"ms", name:"Malay"},
//{value:"ml", name:"Malayalam"},
//{value:"mt", name:"Maltese"},
//{value:"mi", name:"Maori"},
//{value:"mr", name:"Marathi"},
//{value:"mn", name:"Mongolian"},
//{value:"my", name:"Myanmar (Burmese)"},
//{value:"ne", name:"Nepali"},
//{value:"no", name:"Norwegian"},
//{value:"or", name:"Odia (Oriya)"},
//{value:"ps", name:"Pashto"},
//{value:"fa", name:"Persian"},
//{value:"pl", name:"Polish"},
//{value:"pt", name:"Portuguese"},
//{value:"pa", name:"Punjabi"},
//{value:"ro", name:"Romanian"},
{value:"ru", name:"Russian"},
//{value:"sm", name:"Samoan"},
//{value:"gd", name:"Scots Gaelic"},
//{value:"sr", name:"Serbian"},
//{value:"st", name:"Sesotho"},
//{value:"sn", name:"Shona"},
//{value:"sd", name:"Sindhi"},
//{value:"si", name:"Sinhala"},
//{value:"sk", name:"Slovak"},
//{value:"sl", name:"Slovenian"},
//{value:"so", name:"Somali"},
{value:"es", name:"Spanish"},
//{value:"su", name:"Sundanese"},
//{value:"sw", name:"Swahili"},
//{value:"sv", name:"Swedish"},
//{value:"tg", name:"Tajik"},
//{value:"ta", name:"Tamil"},
//{value:"tt", name:"Tatar"},
//{value:"te", name:"Telugu"},
//{value:"th", name:"Thai"},
//{value:"tr", name:"Turkish"},
//{value:"tk", name:"Turkmen"},
//{value:"uk", name:"Ukrainian"},
//{value:"ur", name:"Urdu"},
//{value:"ug", name:"Uyghur"},
//{value:"uz", name:"Uzbek"},
//{value:"vi", name:"Vietnamese"},
//{value:"cy", name:"Welsh"},
//{value:"xh", name:"Xhosa"},
//{value:"yi", name:"Yiddish"},
//{value:"yo", name:"Yoruba"},
//{value:"zu", name:"Zulu"}
];



export function getLanguageByCode(code) {
  return languages.find((x) => x.value === code)?.name !== undefined
    ? languages.find((x) => x.value === code)?.name
    : "";
}

export function getAllLanguages() {
  return languages;
}


export function getGoogleTranslatedLanguages() {
  return GoogleTranslatedLanguages;
}