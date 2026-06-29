/* ============================================================
   ODDVI · i18n motoru + sözlük (EN, TR, DE, FR, HU)
   Hem index.html hem odd-test.html bu dosyayı kullanır.
   Markaya ait sloganlar bilerek İngilizce bırakıldı:
   "What's your Odd?", "Stay Odd.", "Pardon my odd.", "Odd Red".
   ============================================================ */
window.I18N = (function () {
  const langs = ['en','tr','de','fr','hu'];
  const names = {en:'English', tr:'Türkçe', de:'Deutsch', fr:'Français', hu:'Magyar'};

  const dict = {
  en:{
    'nav.meet':"Meet Oddvi",'nav.story':"The Story",'nav.test':"What's your Odd?",
    'hero.eyebrow':"Coming soon · @theoddvi",
    'hero.btnPrimary':"Take the Odd test →",'hero.btnGhost':"See Oddvi in action ↓",
    'hero.lead':"Meet Oddvi — born a little crooked, painted in fifteen colours at once, and proud of it. The face of Pardon My Odd, for people who'd rather be odd than ordinary.",
    'meet.kicker':"Chapter One",'meet.h2':"Meet Oddvi.",
    'meet.p1':"Oddvi was born in the Box of Mistakes — painted wrong, in fifteen colours at once; one eye big, one eye small, the smile slightly crooked. Not a drawing error. That's the whole point.",
    'meet.p2':"Part Jester, part Rebel — a joyful little troublemaker. Oddvi never mocks anyone; it just turns up the colour and says: your odd is already beautiful, go wear it.",
    'meet.c1':"Born in the Box of Mistakes",'meet.c2':"Big eye, small eye",'meet.c3':"Jester × Rebel",'meet.c4':"Default colour: Odd Red",
    'story.kicker':"The Story",'story.h2':"Once, there was Plainville.",
    'story.p1':"In Plainville, everything sat exactly in its place. Streets drawn with a ruler, houses all the same, every smile precisely the same width. Nothing stood out — so for years, nobody remembered anything at all.",
    'story.p2':"Then, at the end of the line, something went wrong. One piece came out painted in all fifteen colours at once. One eye big, one eye small. A crooked smile. The machines screamed “Error!” and threw it into the Box of Mistakes.",
    'story.p3':"A child reached in, pulled it out, and laughed — the first real laugh Plainville had heard in years. Everyone said the same thing: “How… odd.” And it winked its small eye and answered: Pardon my odd.",
    'story.quote':"You're not a mistake. You're what's remembered.",
    'gal.kicker':"A day in the life",'gal.h2':"Ordinary days.<br>Oddly lived.",
    'gal.intro':"Oddvi does everything you do — commuting, snacking, surviving meetings — just a little bit weirder.",
    'cap.skate':"Commuting. Sort of.",'cap.office':"Surviving the 9-to-5.",'cap.fridge':"It's a midnight snack situation.",'cap.party':"The last one dancing.",'cap.detective':"Investigating a suspicious pickle.",'cap.forest':"Definitely not lost.",'cap.watch':"The clock's always a little wrong.",'cap.cafe':"Oat milk, no notes.",'cap.balloons':"Big day. Low energy.",'cap.cozy':"Professional relaxer.",'cap.pizza':"Round two.",'cap.garden':"One flower. That's enough.",
    'man.quote':"Normal is everywhere.<br>Odd is <em>remembered</em>.",'man.sub':"Stay Odd. — The Oddvi Manifesto",
    'sign.kicker':"Almost here",'sign.h2':"Come with me.",'sign.p':"Leave your email and I'll find you the moment Pardon My Odd lands. No spam — just Oddvi.",
    'sign.btn':"Count me in",'sign.ph':"you@example.com",'sign.ok':"You're in! Oddvi will be in touch. 🫧",'sign.err':"Hmm, that email looks a little too odd. Try again?",
    'foot.follow':"Follow the blob:"
  },
  tr:{
    'nav.meet':"Oddvi'yle tanış",'nav.story':"Hikâye",'nav.test':"What's your Odd?",
    'hero.eyebrow':"Çok yakında · @theoddvi",
    'hero.btnPrimary':"Odd testini çöz →",'hero.btnGhost':"Oddvi'yi iş başında gör ↓",
    'hero.lead':"Oddvi'yle tanış — biraz eğri doğdu, aynı anda on beş renge boyandı ve bundan gurur duyuyor. Pardon My Odd'ın yüzü; normal olmaktansa tuhaf olmayı seçenler için.",
    'meet.kicker':"Birinci Bölüm",'meet.h2':"Oddvi'yle tanış.",
    'meet.p1':"Oddvi, Hatalar Kutusu'nda doğdu — yanlış boyandı, hem de aynı anda on beş renkle; bir gözü büyük, bir gözü küçük, gülümsemesi hafif eğri. Bu bir çizim hatası değil. Bütün mesele bu.",
    'meet.p2':"Yarı Soytarı, yarı Asi — neşeli bir baş belası. Oddvi kimseyle alay etmez; sadece rengi açar ve der ki: tuhaflığın zaten güzel, hadi onu giy.",
    'meet.c1':"Hatalar Kutusu'nda doğdu",'meet.c2':"Büyük göz, küçük göz",'meet.c3':"Soytarı × Asi",'meet.c4':"Varsayılan renk: Odd Red",
    'story.kicker':"Hikâye",'story.h2':"Bir zamanlar Düzgünşehir vardı.",
    'story.p1':"Düzgünşehir'de her şey tam yerinde dururdu. Sokaklar cetvelle çizilmişti, evler birbirinin aynısıydı, her gülümseme tam olarak aynı genişlikteydi. Hiçbir şey sırıtmazdı — ve tam bu yüzden yıllardır kimse hiçbir şeyi hatırlamıyordu.",
    'story.p2':"Sonra, bandın sonunda bir şey ters gitti. Bir parça aynı anda on beş renkle boyanmış çıktı. Bir gözü büyük, bir gözü küçük. Eğri bir gülümseme. Makineler “Hata!” diye öttü ve onu Hatalar Kutusu'na attı.",
    'story.p3':"Bir çocuk elini daldırdı, onu çıkardı ve güldü — Düzgünşehir'in yıllardır duymadığı ilk gerçek kahkaha. Bakan herkes aynı şeyi dedi: “Ne kadar… odd.” O da küçük gözünü kırpıp cevap verdi: Pardon my odd.",
    'story.quote':"Sen hata değilsin. Sen akılda kalansın.",
    'gal.kicker':"Bir günün içinden",'gal.h2':"Sıradan günler.<br>Tuhafça yaşanmış.",
    'gal.intro':"Oddvi senin yaptığın her şeyi yapar — işe gitmek, atıştırmak, toplantılardan sağ çıkmak — sadece biraz daha tuhafça.",
    'cap.skate':"İşe gidiş. Sayılır.",'cap.office':"9-6 mesaisinden sağ çıkmak.",'cap.fridge':"Gece atıştırması durumu.",'cap.party':"Pistteki son kişi.",'cap.detective':"Şüpheli turşuyu soruşturuyor.",'cap.forest':"Kesinlikle kaybolmadı.",'cap.watch':"Saat hep birkaç dakika yanlış.",'cap.cafe':"Yulaf sütü, itirazsız.",'cap.balloons':"Büyük gün. Düşük enerji.",'cap.cozy':"Profesyonel tembellik.",'cap.pizza':"İkinci raunt.",'cap.garden':"Tek bir çiçek. Bu kadarı yeter.",
    'man.quote':"Normal her yerde.<br>Odd <em>akılda kalır</em>.",'man.sub':"Stay Odd. — Oddvi Manifestosu",
    'sign.kicker':"Neredeyse burada",'sign.h2':"Gel, benimle.",'sign.p':"E-postanı bırak, Pardon My Odd çıktığı an seni bulayım. Spam yok — sadece Oddvi.",
    'sign.btn':"Beni de yaz",'sign.ph':"sen@ornek.com",'sign.ok':"Listedesin! Oddvi seninle iletişime geçecek. 🫧",'sign.err':"Hmm, bu e-posta biraz fazla tuhaf görünüyor. Tekrar dener misin?",
    'foot.follow':"Blob'u takip et:"
  },
  de:{
    'nav.meet':"Oddvi entdecken",'nav.story':"Die Geschichte",'nav.test':"What's your Odd?",
    'hero.eyebrow':"Bald verfügbar · @theoddvi",
    'hero.btnPrimary':"Mach den Odd-Test →",'hero.btnGhost':"Oddvi in Aktion sehen ↓",
    'hero.lead':"Lerne Oddvi kennen — ein bisschen schief geboren, in fünfzehn Farben gleichzeitig bemalt und stolz darauf. Das Gesicht von Pardon My Odd, für alle, die lieber odd als gewöhnlich sind.",
    'meet.kicker':"Kapitel Eins",'meet.h2':"Lerne Oddvi kennen.",
    'meet.p1':"Oddvi wurde in der Kiste der Fehler geboren — falsch bemalt, in fünfzehn Farben auf einmal; ein Auge groß, eins klein, das Lächeln leicht schief. Kein Zeichenfehler. Genau das ist der Punkt.",
    'meet.p2':"Halb Narr, halb Rebell — ein fröhlicher Störenfried. Oddvi macht sich über niemanden lustig; es dreht einfach die Farbe auf und sagt: dein Odd ist schon schön, also trag es.",
    'meet.c1':"Geboren in der Kiste der Fehler",'meet.c2':"Großes Auge, kleines Auge",'meet.c3':"Narr × Rebell",'meet.c4':"Standardfarbe: Odd Red",
    'story.kicker':"Die Geschichte",'story.h2':"Es war einmal Glattstadt.",
    'story.p1':"In Glattstadt saß alles genau an seinem Platz. Straßen mit dem Lineal gezogen, Häuser alle gleich, jedes Lächeln exakt gleich breit. Nichts fiel auf — und so erinnerte sich jahrelang niemand an irgendetwas.",
    'story.p2':"Dann, am Ende des Bandes, ging etwas schief. Ein Teil kam in allen fünfzehn Farben auf einmal heraus. Ein Auge groß, eins klein. Ein schiefes Lächeln. Die Maschinen schrien “Fehler!” und warfen es in die Kiste der Fehler.",
    'story.p3':"Ein Kind griff hinein, zog es heraus und lachte — das erste echte Lachen seit Jahren in Glattstadt. Alle sagten dasselbe: “Wie… odd.” Und es zwinkerte mit dem kleinen Auge und antwortete: Pardon my odd.",
    'story.quote':"Du bist kein Fehler. Du bist das, woran man sich erinnert.",
    'gal.kicker':"Ein Tag im Leben",'gal.h2':"Gewöhnliche Tage.<br>Odd gelebt.",
    'gal.intro':"Oddvi macht alles, was du machst — pendeln, snacken, Meetings überleben — nur ein bisschen seltsamer.",
    'cap.skate':"Pendeln. Irgendwie.",'cap.office':"Den 9-to-5-Job überleben.",'cap.fridge':"Eine Mitternachtssnack-Lage.",'cap.party':"Der Letzte auf der Tanzfläche.",'cap.detective':"Ermittelt gegen eine verdächtige Gurke.",'cap.forest':"Definitiv nicht verirrt.",'cap.watch':"Die Uhr geht immer ein bisschen falsch.",'cap.cafe':"Hafermilch, keine Diskussion.",'cap.balloons':"Großer Tag. Wenig Energie.",'cap.cozy':"Profi im Entspannen.",'cap.pizza':"Zweite Runde.",'cap.garden':"Eine Blume. Das reicht.",
    'man.quote':"Normal ist überall.<br>Odd <em>bleibt</em>.",'man.sub':"Stay Odd. — Das Oddvi-Manifest",
    'sign.kicker':"Fast da",'sign.h2':"Komm mit mir.",'sign.p':"Lass deine E-Mail da und ich finde dich, sobald Pardon My Odd startet. Kein Spam — nur Oddvi.",
    'sign.btn':"Ich bin dabei",'sign.ph':"du@beispiel.com",'sign.ok':"Du bist dabei! Oddvi meldet sich. 🫧",'sign.err':"Hmm, diese E-Mail sieht ein bisschen zu odd aus. Nochmal versuchen?",
    'foot.follow':"Folge dem Blob:"
  },
  fr:{
    'nav.meet':"Rencontrer Oddvi",'nav.story':"L'histoire",'nav.test':"What's your Odd?",
    'hero.eyebrow':"Bientôt disponible · @theoddvi",
    'hero.btnPrimary':"Faire le test Odd →",'hero.btnGhost':"Voir Oddvi en action ↓",
    'hero.lead':"Voici Oddvi — né un peu de travers, peint en quinze couleurs à la fois, et fier de l'être. Le visage de Pardon My Odd, pour celles et ceux qui préfèrent être odd plutôt qu'ordinaires.",
    'meet.kicker':"Chapitre Un",'meet.h2':"Voici Oddvi.",
    'meet.p1':"Oddvi est né dans la Boîte des Erreurs — mal peint, en quinze couleurs d'un coup ; un œil grand, un œil petit, le sourire un peu de travers. Pas une erreur de dessin. C'est tout le propos.",
    'meet.p2':"Mi-Bouffon, mi-Rebelle — un trublion joyeux. Oddvi ne se moque de personne ; il monte simplement la couleur et dit : ton odd est déjà beau, alors porte-le.",
    'meet.c1':"Né dans la Boîte des Erreurs",'meet.c2':"Grand œil, petit œil",'meet.c3':"Bouffon × Rebelle",'meet.c4':"Couleur par défaut : Odd Red",
    'story.kicker':"L'histoire",'story.h2':"Il était une fois Villeplate.",
    'story.p1':"À Villeplate, tout était exactement à sa place. Des rues tracées à la règle, des maisons identiques, chaque sourire de la même largeur au millimètre. Rien ne dépassait — alors, pendant des années, personne ne se souvenait de rien.",
    'story.p2':"Puis, au bout de la chaîne, quelque chose a déraillé. Une pièce est sortie peinte en quinze couleurs à la fois. Un œil grand, un œil petit. Un sourire de travers. Les machines ont crié « Erreur ! » et l'ont jetée dans la Boîte des Erreurs.",
    'story.p3':"Un enfant a plongé la main, l'a sortie et a ri — le premier vrai rire entendu à Villeplate depuis des années. Tout le monde disait la même chose : « Comme c'est… odd. » Et il a cligné de son petit œil et a répondu : Pardon my odd.",
    'story.quote':"Tu n'es pas une erreur. Tu es ce dont on se souvient.",
    'gal.kicker':"Une journée ordinaire",'gal.h2':"Des jours ordinaires.<br>Vécus odd.",
    'gal.intro':"Oddvi fait tout ce que tu fais — les trajets, les grignotages, survivre aux réunions — juste un peu plus bizarrement.",
    'cap.skate':"Les trajets. En quelque sorte.",'cap.office':"Survivre au métro-boulot.",'cap.fridge':"Une affaire de grignotage nocturne.",'cap.party':"Le dernier sur la piste.",'cap.detective':"Enquête sur un cornichon suspect.",'cap.forest':"Pas perdu du tout.",'cap.watch':"L'horloge est toujours un peu fausse.",'cap.cafe':"Lait d'avoine, sans discuter.",'cap.balloons':"Grand jour. Peu d'énergie.",'cap.cozy':"Relaxation professionnelle.",'cap.pizza':"Deuxième round.",'cap.garden':"Une fleur. Ça suffit.",
    'man.quote':"Le normal est partout.<br>L'odd, on <em>s'en souvient</em>.",'man.sub':"Stay Odd. — Le Manifeste Oddvi",
    'sign.kicker':"Presque là",'sign.h2':"Viens avec moi.",'sign.p':"Laisse ton e-mail et je te retrouve dès que Pardon My Odd sort. Pas de spam — juste Oddvi.",
    'sign.btn':"J'en suis",'sign.ph':"toi@exemple.com",'sign.ok':"C'est noté ! Oddvi te recontacte. 🫧",'sign.err':"Hmm, cet e-mail a l'air un peu trop odd. On réessaie ?",
    'foot.follow':"Suis le blob :"
  },
  hu:{
    'nav.meet':"Ismerd meg Oddvit",'nav.story':"A történet",'nav.test':"What's your Odd?",
    'hero.eyebrow':"Hamarosan · @theoddvi",
    'hero.btnPrimary':"Csináld meg az Odd-tesztet →",'hero.btnGhost':"Nézd Oddvit akcióban ↓",
    'hero.lead':"Ismerd meg Oddvit — kicsit görbén született, egyszerre tizenöt színben, és büszke rá. A Pardon My Odd arca, azoknak, akik inkább furák, mint hétköznapiak.",
    'meet.kicker':"Első fejezet",'meet.h2':"Ismerd meg Oddvit.",
    'meet.p1':"Oddvi a Hibák Dobozában született — rosszul festve, egyszerre tizenöt színben; egyik szeme nagy, másik kicsi, a mosolya kicsit görbe. Nem rajzhiba. Pont ez a lényeg.",
    'meet.p2':"Félig Bohóc, félig Lázadó — vidám kis rendbontó. Oddvi senkit sem csúfol; csak feltekeri a színt, és azt mondja: a te furaságod már most is szép, hát viseld.",
    'meet.c1':"A Hibák Dobozában született",'meet.c2':"Nagy szem, kis szem",'meet.c3':"Bohóc × Lázadó",'meet.c4':"Alapszín: Odd Red",
    'story.kicker':"A történet",'story.h2':"Volt egyszer Simaváros.",
    'story.p1':"Simavárosban minden pontosan a helyén volt. Vonalzóval húzott utcák, egyforma házak, minden mosoly milliméterre ugyanolyan széles. Semmi sem lógott ki — így évekig senki sem emlékezett semmire.",
    'story.p2':"Aztán a futószalag végén valami félresikerült. Egy darab egyszerre tizenöt színben jött ki. Egyik szeme nagy, másik kicsi. Görbe mosoly. A gépek azt sikították: “Hiba!” — és bedobták a Hibák Dobozába.",
    'story.p3':"Egy gyerek benyúlt, kihúzta, és felnevetett — az első igazi nevetés Simavárosban évek óta. Mindenki ugyanazt mondta: “Milyen… odd.” Ő meg a kis szemével kacsintott, és így felelt: Pardon my odd.",
    'story.quote':"Nem vagy hiba. Te vagy az, akire emlékeznek.",
    'gal.kicker':"Egy nap az életből",'gal.h2':"Hétköznapi napok.<br>Furán megélve.",
    'gal.intro':"Oddvi mindent megcsinál, amit te — ingázik, nassol, túléli a meetingeket — csak egy kicsit furábban.",
    'cap.skate':"Ingázás. Olyasmi.",'cap.office':"Túlélni a kilenc-ötöt.",'cap.fridge':"Éjféli nasi-helyzet.",'cap.party':"Az utolsó a táncparketten.",'cap.detective':"Egy gyanús uborkát nyomoz.",'cap.forest':"Egyáltalán nem tévedt el.",'cap.watch':"Az óra mindig kicsit rosszul jár.",'cap.cafe':"Zabtej, vita nélkül.",'cap.balloons':"Nagy nap. Kevés energia.",'cap.cozy':"Profi lazító.",'cap.pizza':"Második kör.",'cap.garden':"Egy virág. Ennyi elég.",
    'man.quote':"A normális mindenhol ott van.<br>Az oddra <em>emlékeznek</em>.",'man.sub':"Stay Odd. — Az Oddvi Kiáltvány",
    'sign.kicker':"Mindjárt itt",'sign.h2':"Gyere velem.",'sign.p':"Hagyd itt az e-mailed, és szólok, amint a Pardon My Odd megérkezik. Semmi spam — csak Oddvi.",
    'sign.btn':"Benne vagyok",'sign.ph':"te@pelda.com",'sign.ok':"Fent vagy a listán! Oddvi jelentkezik. 🫧",'sign.err':"Hmm, ez az e-mail kicsit túl odd. Megpróbálod újra?",
    'foot.follow':"Kövesd a blobot:"
  }
  };

  function pick(){
    let l; try{ l = localStorage.getItem('oddvi_lang'); }catch(e){}
    if(!l){ const n=(navigator.language||'en').slice(0,2).toLowerCase(); l = langs.includes(n)?n:'en'; }
    return langs.includes(l)?l:'en';
  }
  function apply(lang){
    const d = dict[lang]||dict.en, f = dict.en;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');const v=(d[k]!=null?d[k]:f[k]);if(v!=null)el.textContent=v;});
    document.querySelectorAll('[data-i18n-html]').forEach(el=>{const k=el.getAttribute('data-i18n-html');const v=(d[k]!=null?d[k]:f[k]);if(v!=null)el.innerHTML=v;});
    document.querySelectorAll('[data-i18n-ph]').forEach(el=>{const k=el.getAttribute('data-i18n-ph');const v=(d[k]!=null?d[k]:f[k]);if(v!=null)el.setAttribute('placeholder',v);});
    try{ localStorage.setItem('oddvi_lang',lang); }catch(e){}
    window.dispatchEvent(new CustomEvent('oddvi:lang',{detail:{lang:lang, dict:d}}));
  }
  function init(){
    const sel=document.getElementById('langSelect');
    const l=pick();
    if(sel){
      sel.innerHTML=langs.map(x=>'<option value="'+x+'">'+names[x]+'</option>').join('');
      sel.value=l;
      sel.addEventListener('change',function(e){apply(e.target.value);});
    }
    apply(l);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();

  return {apply:apply, pick:pick, langs:langs, names:names, dict:dict};
})();
