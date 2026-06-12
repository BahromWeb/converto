import type { TranslationMap } from "../types";

import en from "./en";
import uz from "./uz";
import ru from "./ru";
import es from "./es";
import zh from "./zh";
import ar from "./ar";
import hi from "./hi";
import pt from "./pt";
import de from "./de";
import fr from "./fr";
import ja from "./ja";
import ko from "./ko";
import tr from "./tr";
import it from "./it";
import id from "./id";
import pl from "./pl";
import vi from "./vi";
import nl from "./nl";
import th from "./th";
import uk from "./uk";
import zhTw from "./zh-tw";
import bg from "./bg";
import ca from "./ca";
import el from "./el";
import ms from "./ms";
import sv from "./sv";
import sw from "./sw";

export const locales: Record<string, TranslationMap> = {
  en,
  uz,
  ru,
  es,
  zh,
  ar,
  hi,
  pt,
  de,
  fr,
  ja,
  ko,
  tr,
  it,
  id,
  pl,
  vi,
  nl,
  th,
  uk,
  "zh-tw": zhTw,
  bg,
  ca,
  el,
  ms,
  sv,
  sw,
};

export default locales;
