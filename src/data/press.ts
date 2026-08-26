/**
 * Публикации о проекте во внешних изданиях — секция «О проекте» в подвале.
 *
 * Отдельный файл, а не строки в `Footer.astro`: список растёт по мере того,
 * как о каталоге пишут, и дописывать сюда строку не должно означать правку
 * компонента.
 *
 * Подпись ссылки не хранится: она собирается из `outlet` через ключ
 * `footer.about.press` («Статья на {outlet}» / «Article on {outlet}»), поэтому
 * новая публикация не требует ни одного нового ключа в локалях.
 */

export interface PressMention {
	/** Издание — единственное, что попадает в подпись ссылки. */
	outlet: string;
	href: string;
	/** Дата публикации, ISO. Пока не выводится, но сортировать список
	    когда-нибудь придётся, а выяснять её задним числом дороже. */
	date?: string;
}

export const pressMentions: PressMention[] = [
	{
    outlet: "milliard.tatar",
		href: "https://milliard.tatar/news/naidi-svoix-ryadom-kak-veb-razrabotcik-iz-almaty-sobral-v-odnom-kataloge-pocti-400-tatarskix-i-drugix-soobshhestv-po-vsemu-miru-10158",
	},
];
