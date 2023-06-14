import { createI18n } from "vue-i18n";

const loadLocaleMessages = () => {
  const locales = require.context(
    "../../language",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages: any = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
};
// 创建 i18n
const i18n = createI18n({
  legacy: false,
  globalInjection: true, // 全局模式，可以直接使用 $t
  locale: localStorage.get("lang") || "zh-cn",
  messages: loadLocaleMessages(),
});

export default i18n;
