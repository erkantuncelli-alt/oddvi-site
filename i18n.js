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
    'nav.meet':"Meet Oddvi",'nav.story':"The Story",'nav.gallery':"Gallery",'nav.test':"What's your Odd?",
    'hero.eyebrow':"Coming soon · @theoddvi",
    'hero.btnPrimary':"Take the Odd test →",'hero.btnGhost':"See Oddvi in action ↓",
    'hero.lead':"Meet Oddvi — it fell from the sky as a black O, opened its eyes, grew its own arms and legs, and stood up. Nobody told it how to be. It raised one brow, shrugged, and asked \"Odd?\" One second of silence. Then it smiled: \"Exactly.\" The face of Pardon My Odd, for people who'd rather be odd than ordinary.",
    'meet.kicker':"Chapter One · Philosophy",'meet.h2':"This Is How Oddvi Sees The World.",
    'meet.p1':"Nobody knows where Oddvi came from. But everyone knows what it believes: normal was never a rule — just a habit nobody questioned.",
    'meet.p2':"It doesn't perform sadness or happiness for the camera. It just is — one color, two eyes that never blink, and zero interest in blending in.",
    'meet.c1':"Stay odd.",'meet.c2':"Normal is a rumor.",'meet.c3':"Blend in, disappear.",'meet.c4':"The mouth lies. The eyes don't.",'meet.c5':"You don't ask permission to be yourself.",
    'story.kicker':"The Legend",'story.h2':"Nobody Knows Where Oddvi Came From.",
    'story.p1':"Some say it fell from a star, in the one hour of the night when nobody was looking. Some believe the wind carried it in, straight into the middle of a bored little street.",
    'story.p2':"Others claim it escaped from a child's drawing before the ink even dried. Some say Oddvi never came from anywhere at all — because belonging was never really the point.",
    'story.p3':"But everyone agrees on one thing: Oddvi shows up the moment someone dares to be themselves.",
    'story.quote':"Where it came from doesn't matter. When it shows up does.",
    'gal.kicker':"A day in the life",'gal.h2':"Ordinary days.<br>Oddly lived.",
    'gal.intro':"Oddvi does everything you do — commuting, snacking, surviving meetings — just a little bit weirder.",'gal.cta':"See the full gallery →",
    'cap.skate':"Commuting. Sort of.",'cap.office':"Surviving the 9-to-5.",'cap.fridge':"It's a midnight snack situation.",'cap.party':"The last one dancing.",'cap.detective':"Investigating a suspicious pickle.",'cap.forest':"Definitely not lost.",'cap.watch':"The clock's always a little wrong.",'cap.cafe':"Oat milk, no notes.",'cap.balloons':"Big day. Low energy.",'cap.cozy':"Professional relaxer.",'cap.pizza':"Round two.",'cap.garden':"One flower. That's enough.",
    'man.quote':"Normal is everywhere.<br>Odd is <em>remembered</em>.",'man.sub':"Stay Odd. — The Oddvi Manifesto",
    'sign.kicker':"Almost here",'sign.h2':"Come with me.",'sign.p':"Leave your email and I'll find you the moment Pardon My Odd lands. No spam — just Oddvi.",
    'sign.btn':"Count me in",'sign.ph':"you@example.com",'sign.ok':"You're in! Oddvi will be in touch. 🫧",'sign.err':"Hmm, that email looks a little too odd. Try again?",
    'foot.follow':"Follow the blob, say hi:",
    'social.kicker':"Come say hi",'social.h2':"Tag us. DM us. Be seen.",
    'social.p':"Post your Odd, tag @theoddvi, or just slide into the DMs. Every message gets a reply — from Oddvi, not a bot.",
    'social.btn':"Follow @theoddvi"
  },
  tr:{
    'nav.meet':"Oddvi'yle tanış",'nav.story':"Hikâye",'nav.gallery':"Galeri",'nav.test':"What's your Odd?",
    'hero.eyebrow':"Çok yakında · @theoddvi",
    'hero.btnPrimary':"Odd testini çöz →",'hero.btnGhost':"Oddvi'yi iş başında gör ↓",
    'hero.lead':"Oddvi'yle tanış — gökten siyah bir O olarak düştü, gözlerini açtı, kollarını ve bacaklarını kendi çıkardı, ayağa kalktı. Kimse ona nasıl olması gerektiğini söylemedi. Tek kaşını kaldırdı, omuz silkti: \"Odd?\" Bir saniye sessizlik. Sonra gülümsedi: \"Exactly.\" Pardon My Odd'ın yüzü; normal olmaktansa tuhaf olmayı seçenler için.",
    'meet.kicker':"Birinci Bölüm · Felsefe",'meet.h2':"Oddvi Dünyaya Böyle Bakar.",
    'meet.p1':"Kimse Oddvi'nin nereden geldiğini bilmiyor. Ama herkes onun neye inandığını biliyor: normal olmak bir zorunluluk değil, sadece kimsenin sorgulamadığı bir alışkanlık.",
    'meet.p2':"Kamera için üzülmez ya da mutlu görünmez. Sadece kendisidir — tek renk, hiç kırpılmayan iki göz ve uyum sağlamaya sıfır ilgi.",
    'meet.c1':"Tuhaf kal.",'meet.c2':"Normal bir söylenti.",'meet.c3':"Uyum sağlarsan kaybolursun.",'meet.c4':"Ağız yalan söyler, gözler söylemez.",'meet.c5':"Kendin olmak için izin istemezsin.",
    'story.kicker':"Efsane",'story.h2':"Oddvi'nin Nereden Geldiğini Kimse Bilmiyor.",
    'story.p1':"Bazıları bir yıldızdan düştüğünü söylüyor, gecenin kimsenin bakmadığı o tek saatinde. Bazıları rüzgârın onu getirdiğine inanıyor, tam da sıkılmış bir sokağın ortasına.",
    'story.p2':"Bazılarıysa mürekkep kurumadan bir çocuğun elinden kaçan bir çizim olduğunu iddia ediyor. Bazıları ise Oddvi'nin hiçbir yerden gelmediğini söylüyor — çünkü ait olmak zaten hiç meselesi olmadı.",
    'story.p3':"Ama herkes tek bir konuda hemfikir: Oddvi, biri kendisi olmaya cesaret ettiği an ortaya çıkıyor.",
    'story.quote':"Nereden geldiği önemli değil. Önemli olan, ne zaman geldiği.",
    'gal.kicker':"Bir günün içinden",'gal.h2':"Sıradan günler.<br>Tuhafça yaşanmış.",
    'gal.intro':"Oddvi senin yaptığın her şeyi yapar — işe gitmek, atıştırmak, toplantılardan sağ çıkmak — sadece biraz daha tuhafça.",'gal.cta':"Galerinin tamamını gör →",
    'cap.skate':"İşe gidiş. Sayılır.",'cap.office':"9-6 mesaisinden sağ çıkmak.",'cap.fridge':"Gece atıştırması durumu.",'cap.party':"Pistteki son kişi.",'cap.detective':"Şüpheli turşuyu soruşturuyor.",'cap.forest':"Kesinlikle kaybolmadı.",'cap.watch':"Saat hep birkaç dakika yanlış.",'cap.cafe':"Yulaf sütü, itirazsız.",'cap.balloons':"Büyük gün. Düşük enerji.",'cap.cozy':"Profesyonel tembellik.",'cap.pizza':"İkinci raunt.",'cap.garden':"Tek bir çiçek. Bu kadarı yeter.",
    'man.quote':"Normal her yerde.<br>Odd <em>akılda kalır</em>.",'man.sub':"Stay Odd. — Oddvi Manifestosu",
    'sign.kicker':"Neredeyse burada",'sign.h2':"Gel, benimle.",'sign.p':"E-postanı bırak, Pardon My Odd çıktığı an seni bulayım. Spam yok — sadece Oddvi.",
    'sign.btn':"Beni de yaz",'sign.ph':"sen@ornek.com",'sign.ok':"Listedesin! Oddvi seninle iletişime geçecek. 🫧",'sign.err':"Hmm, bu e-posta biraz fazla tuhaf görünüyor. Tekrar dener misin?",
    'foot.follow':"Blob'u takip et, merhaba de:",
    'social.kicker':"Gel, merhaba de",'social.h2':"Etiketle. DM'den yaz. Görün.",
    'social.p':"Kendi Odd'unu paylaş, @theoddvi'yi etiketle, ya da direkt DM'den yaz. Her mesaja cevap veririz — bot değil, Oddvi'nin kendisi.",
    'social.btn':"@theoddvi'yi takip et"
  },
  de:{
    'nav.meet':"Oddvi entdecken",'nav.story':"Die Geschichte",'nav.test':"What's your Odd?",
    'hero.eyebrow':"Bald verfügbar · @theoddvi",
    'hero.btnPrimary':"Mach den Odd-Test →",'hero.btnGhost':"Oddvi in Aktion sehen ↓",
    'hero.lead':"Lerne Oddvi kennen — es fiel als schwarzes O vom Himmel, öffnete die Augen, ließ sich eigene Arme und Beine wachsen und stand auf. Niemand sagte ihm, wie es sein sollte. Es hob eine Augenbraue, zuckte mit den Schultern: „Odd?\" Eine Sekunde Stille. Dann lächelte es: „Exactly.\" Das Gesicht von Pardon My Odd, für alle, die lieber odd als gewöhnlich sind.",
    'meet.kicker':"Kapitel Eins · Philosophie",'meet.h2':"So sieht Oddvi die Welt.",
    'meet.p1':"Niemand weiß, woher Oddvi kommt. Aber jeder weiß, woran es glaubt: normal war nie eine Regel — nur eine Gewohnheit, die keiner hinterfragt hat.",
    'meet.p2':"Es spielt für die Kamera weder Traurigkeit noch Freude. Es ist einfach da — eine Farbe, zwei Augen, die nie blinzeln, und null Interesse daran, sich anzupassen.",
    'meet.c1':"Bleib seltsam.",'meet.c2':"Normal ist ein Gerücht.",'meet.c3':"Passt du dich an, verschwindest du.",'meet.c4':"Der Mund lügt. Die Augen nicht.",'meet.c5':"Du brauchst keine Erlaubnis, du selbst zu sein.",
    'story.kicker':"Die Legende",'story.h2':"Niemand weiß, woher Oddvi kam.",
    'story.p1':"Manche sagen, es sei von einem Stern gefallen, in der einen Stunde der Nacht, in der niemand hinsah. Manche glauben, der Wind habe es mitten in eine gelangweilte kleine Straße getragen.",
    'story.p2':"Andere behaupten, es sei aus der Zeichnung eines Kindes entkommen, bevor die Tinte trocknen konnte. Manche sagen, Oddvi sei nie von irgendwoher gekommen — weil Dazugehören nie der Punkt war.",
    'story.p3':"Aber alle sind sich in einem einig: Oddvi taucht genau in dem Moment auf, in dem sich jemand traut, er selbst zu sein.",
    'story.quote':"Woher es kam, spielt keine Rolle. Wann es auftaucht, schon.",
    'gal.kicker':"Ein Tag im Leben",'gal.h2':"Gewöhnliche Tage.<br>Odd gelebt.",
    'gal.intro':"Oddvi macht alles, was du machst — pendeln, snacken, Meetings überleben — nur ein bisschen seltsamer.",
    'cap.skate':"Pendeln. Irgendwie.",'cap.office':"Den 9-to-5-Job überleben.",'cap.fridge':"Eine Mitternachtssnack-Lage.",'cap.party':"Der Letzte auf der Tanzfläche.",'cap.detective':"Ermittelt gegen eine verdächtige Gurke.",'cap.forest':"Definitiv nicht verirrt.",'cap.watch':"Die Uhr geht immer ein bisschen falsch.",'cap.cafe':"Hafermilch, keine Diskussion.",'cap.balloons':"Großer Tag. Wenig Energie.",'cap.cozy':"Profi im Entspannen.",'cap.pizza':"Zweite Runde.",'cap.garden':"Eine Blume. Das reicht.",
    'man.quote':"Normal ist überall.<br>Odd <em>bleibt</em>.",'man.sub':"Stay Odd. — Das Oddvi-Manifest",
    'sign.kicker':"Fast da",'sign.h2':"Komm mit mir.",'sign.p':"Lass deine E-Mail da und ich finde dich, sobald Pardon My Odd startet. Kein Spam — nur Oddvi.",
    'sign.btn':"Ich bin dabei",'sign.ph':"du@beispiel.com",'sign.ok':"Du bist dabei! Oddvi meldet sich. 🫧",'sign.err':"Hmm, diese E-Mail sieht ein bisschen zu odd aus. Nochmal versuchen?",
    'foot.follow':"Folge dem Blob, sag hallo:",
    'social.kicker':"Sag hallo",'social.h2':"Tagge uns. Schreib uns. Werd gesehen.",
    'social.p':"Poste dein Odd, tagge @theoddvi, oder schreib einfach eine DM. Jede Nachricht bekommt eine Antwort — von Oddvi, nicht von einem Bot.",
    'social.btn':"@theoddvi folgen"
  },
  fr:{
    'nav.meet':"Rencontrer Oddvi",'nav.story':"L'histoire",'nav.test':"What's your Odd?",
    'hero.eyebrow':"Bientôt disponible · @theoddvi",
    'hero.btnPrimary':"Faire le test Odd →",'hero.btnGhost':"Voir Oddvi en action ↓",
    'hero.lead':"Voici Oddvi — il est tombé du ciel comme un O noir, a ouvert les yeux, s'est fait pousser ses propres bras et jambes, et s'est levé. Personne ne lui a dit comment être. Il a levé un sourcil, haussé les épaules : « Odd ? » Une seconde de silence. Puis il a souri : « Exactly. » Le visage de Pardon My Odd, pour celles et ceux qui préfèrent être odd plutôt qu'ordinaires.",
    'meet.kicker':"Chapitre Un · Philosophie",'meet.h2':"Voici comment Oddvi voit le monde.",
    'meet.p1':"Personne ne sait d'où vient Oddvi. Mais tout le monde sait en quoi il croit : la normalité n'a jamais été une règle — juste une habitude que personne n'a jamais questionnée.",
    'meet.p2':"Il ne joue ni la tristesse ni la joie pour la caméra. Il est, tout simplement — une couleur, deux yeux qui ne clignent jamais, et aucune envie de se fondre dans la masse.",
    'meet.c1':"Reste bizarre.",'meet.c2':"Le normal n'est qu'une rumeur.",'meet.c3':"Se fondre dans la masse, c'est disparaître.",'meet.c4':"La bouche ment. Les yeux, jamais.",'meet.c5':"Tu n'as pas besoin de permission pour être toi-même.",
    'story.kicker':"La Légende",'story.h2':"Personne ne sait d'où vient Oddvi.",
    'story.p1':"Certains disent qu'il est tombé d'une étoile, pendant la seule heure de la nuit où personne ne regardait. D'autres pensent que le vent l'a porté au beau milieu d'une rue qui s'ennuyait.",
    'story.p2':"D'autres encore prétendent qu'il s'est échappé du dessin d'un enfant avant même que l'encre ne sèche. Certains disent qu'Oddvi ne vient de nulle part — parce qu'appartenir n'a jamais vraiment été la question.",
    'story.p3':"Mais tout le monde s'accorde sur un point : Oddvi apparaît au moment où quelqu'un ose être lui-même.",
    'story.quote':"D'où il vient n'a pas d'importance. Le moment où il apparaît, si.",
    'gal.kicker':"Une journée ordinaire",'gal.h2':"Des jours ordinaires.<br>Vécus odd.",
    'gal.intro':"Oddvi fait tout ce que tu fais — les trajets, les grignotages, survivre aux réunions — juste un peu plus bizarrement.",
    'cap.skate':"Les trajets. En quelque sorte.",'cap.office':"Survivre au métro-boulot.",'cap.fridge':"Une affaire de grignotage nocturne.",'cap.party':"Le dernier sur la piste.",'cap.detective':"Enquête sur un cornichon suspect.",'cap.forest':"Pas perdu du tout.",'cap.watch':"L'horloge est toujours un peu fausse.",'cap.cafe':"Lait d'avoine, sans discuter.",'cap.balloons':"Grand jour. Peu d'énergie.",'cap.cozy':"Relaxation professionnelle.",'cap.pizza':"Deuxième round.",'cap.garden':"Une fleur. Ça suffit.",
    'man.quote':"Le normal est partout.<br>L'odd, on <em>s'en souvient</em>.",'man.sub':"Stay Odd. — Le Manifeste Oddvi",
    'sign.kicker':"Presque là",'sign.h2':"Viens avec moi.",'sign.p':"Laisse ton e-mail et je te retrouve dès que Pardon My Odd sort. Pas de spam — juste Oddvi.",
    'sign.btn':"J'en suis",'sign.ph':"toi@exemple.com",'sign.ok':"C'est noté ! Oddvi te recontacte. 🫧",'sign.err':"Hmm, cet e-mail a l'air un peu trop odd. On réessaie ?",
    'foot.follow':"Suis le blob, dis bonjour :",
    'social.kicker':"Viens dire bonjour",'social.h2':"Tague-nous. Écris-nous. Fais-toi voir.",
    'social.p':"Poste ton Odd, tague @theoddvi, ou glisse-toi simplement dans les DM. Chaque message reçoit une réponse — d'Oddvi, pas d'un bot.",
    'social.btn':"Suivre @theoddvi"
  },
  hu:{
    'nav.meet':"Ismerd meg Oddvit",'nav.story':"A történet",'nav.test':"What's your Odd?",
    'hero.eyebrow':"Hamarosan · @theoddvi",
    'hero.btnPrimary':"Csináld meg az Odd-tesztet →",'hero.btnGhost':"Nézd Oddvit akcióban ↓",
    'hero.lead':"Ismerd meg Oddvit — fekete O-ként hullott alá az égből, kinyitotta a szemét, saját maga növesztette a karjait és lábait, majd felállt. Senki sem mondta meg neki, milyennek kell lennie. Felhúzta az egyik szemöldökét, vállat vont: „Odd?\" Egy másodperc csend. Aztán elmosolyodott: „Exactly.\" A Pardon My Odd arca, azoknak, akik inkább furák, mint hétköznapiak.",
    'meet.kicker':"Első fejezet · Filozófia",'meet.h2':"Így látja Oddvi a világot.",
    'meet.p1':"Senki sem tudja, honnan jött Oddvi. De mindenki tudja, miben hisz: a normális sosem volt szabály — csak egy megszokás, amit senki sem kérdőjelezett meg.",
    'meet.p2':"Nem játssza el a szomorúságot vagy a boldogságot a kamerának. Egyszerűen csak van — egy szín, két szem, ami sosem pislog, és nulla érdeklődés a beolvadás iránt.",
    'meet.c1':"Maradj fura.",'meet.c2':"A normális csak pletyka.",'meet.c3':"Ha beolvadsz, eltűnsz.",'meet.c4':"A száj hazudik. A szem nem.",'meet.c5':"Nem kell engedély ahhoz, hogy önmagad legyél.",
    'story.kicker':"A legenda",'story.h2':"Senki sem tudja, honnan jött Oddvi.",
    'story.p1':"Egyesek szerint egy csillagról esett le, az éjszaka azon egyetlen órájában, amikor senki sem nézett oda. Mások szerint a szél hozta be, egyenesen egy unatkozó kis utca közepére.",
    'story.p2':"Megint mások szerint egy gyerekrajzból szökött meg, még mielőtt a tinta megszáradt volna. Néhányan azt mondják, Oddvi valójában sehonnan sem jött — mert a hovatartozás sosem volt igazán a lényeg.",
    'story.p3':"De egy dologban mindenki egyetért: Oddvi pontosan akkor bukkan fel, amikor valaki mer önmaga lenni.",
    'story.quote':"Nem számít, honnan jött. Az számít, mikor bukkan fel.",
    'gal.kicker':"Egy nap az életből",'gal.h2':"Hétköznapi napok.<br>Furán megélve.",
    'gal.intro':"Oddvi mindent megcsinál, amit te — ingázik, nassol, túléli a meetingeket — csak egy kicsit furábban.",
    'cap.skate':"Ingázás. Olyasmi.",'cap.office':"Túlélni a kilenc-ötöt.",'cap.fridge':"Éjféli nasi-helyzet.",'cap.party':"Az utolsó a táncparketten.",'cap.detective':"Egy gyanús uborkát nyomoz.",'cap.forest':"Egyáltalán nem tévedt el.",'cap.watch':"Az óra mindig kicsit rosszul jár.",'cap.cafe':"Zabtej, vita nélkül.",'cap.balloons':"Nagy nap. Kevés energia.",'cap.cozy':"Profi lazító.",'cap.pizza':"Második kör.",'cap.garden':"Egy virág. Ennyi elég.",
    'man.quote':"A normális mindenhol ott van.<br>Az oddra <em>emlékeznek</em>.",'man.sub':"Stay Odd. — Az Oddvi Kiáltvány",
    'sign.kicker':"Mindjárt itt",'sign.h2':"Gyere velem.",'sign.p':"Hagyd itt az e-mailed, és szólok, amint a Pardon My Odd megérkezik. Semmi spam — csak Oddvi.",
    'sign.btn':"Benne vagyok",'sign.ph':"te@pelda.com",'sign.ok':"Fent vagy a listán! Oddvi jelentkezik. 🫧",'sign.err':"Hmm, ez az e-mail kicsit túl odd. Megpróbálod újra?",
    'foot.follow':"Kövesd a blobot, köszönj be:",
    'social.kicker':"Köszönj be",'social.h2':"Jelölj meg. Írj DM-et. Legyél látható.",
    'social.p':"Oszd meg a saját Odd-odat, jelöld meg a @theoddvi-t, vagy csak írj DM-et. Minden üzenetre válaszolunk — Oddvi maga, nem egy bot.",
    'social.btn':"Kövesd: @theoddvi"
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
    document.querySelectorAll('#langSwitch [data-lang]').forEach(function(b){b.setAttribute('aria-pressed', b.getAttribute('data-lang')===lang ? 'true':'false');});
    var _sel=document.getElementById('langSelect'); if(_sel) _sel.value=lang;
    window.dispatchEvent(new CustomEvent('oddvi:lang',{detail:{lang:lang, dict:d}}));
  }
  function init(){
    const l=pick();
    const host=document.getElementById('langSwitch');
    if(host){
      host.innerHTML=langs.map(function(x){
        return '<button type="button" class="lang-btn" data-lang="'+x+'" title="'+names[x]+'" aria-pressed="'+(x===l)+'">'+x.toUpperCase()+'</button>';
      }).join('');
      host.addEventListener('click',function(e){
        const b=e.target.closest('[data-lang]');
        if(b) apply(b.getAttribute('data-lang'));
      });
    }
    const sel=document.getElementById('langSelect');
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

/* ============================================================
   QUIZ sözlüğü — odd-test.html için (5 dil)
   ui: arayüz · q: sorular [{t, o:[[metin, arketipKey]]}] · r: sonuçlar
   Arketip anahtarları (explorer, creative, nightowl, zen, rebel, dreamer)
   ve "Odd" kelimesi tüm dillerde sabittir.
   ============================================================ */
window.I18N.quiz = {
 en:{
  ui:{home:"← Back home",eyebrow:"The Oddvi Test",intro:"Ten quick questions. One very specific kind of weird at the end — plus a wallpaper, a profile picture and your own Odd card to keep.",start:"Start the test →",qcount:"Question {n} of {total}",back:"← Back",youAre:"You are…",dlTitle:"Take your Odd with you",dlHint:"Three free downloads, made just for your result.",dlWallpaper:"Phone wallpaper",dlProfile:"Profile picture",dlCard:"Odd card",download:"Download",building:"Building…",blocked:"Preview blocked here — works on the live site",retake:"↺ Retake the test",updates:"Get launch updates →"},
  q:[
   {t:"It's the weekend. The plan is…",o:[["Get cozy at home and do gloriously nothing","dreamer"],["Go somewhere I've never been","explorer"],["Disappear into nature","zen"],["Out with friends till sunrise","nightowl"]]},
   {t:"Your ideal kind of night?",o:[["Somewhere loud and late","nightowl"],["Making something with my hands","creative"],["Stargazing in total quiet","dreamer"],["Doing something I probably shouldn't","rebel"]]},
   {t:"Pick a 2am snack.",o:[["Cold pizza, no shame","nightowl"],["Whatever's most adventurous","explorer"],["Herbal tea, actually","zen"],["The leftover cake. All of it.","rebel"]]},
   {t:"Your room/desk looks like…",o:[["Organized chaos of projects","creative"],["Maps, gadgets and souvenirs","explorer"],["Minimal, calm, clear","zen"],["Fairy lights and a pillow fort","dreamer"]]},
   {t:"Choose a superpower.",o:[["Teleport anywhere, instantly","explorer"],["Turn any idea real","creative"],["Never need to sleep","nightowl"],["Permanent inner peace","zen"]]},
   {t:"At a party, you're…",o:[["Still dancing when the lights come on","nightowl"],["Deep in one good conversation","dreamer"],["Talking everyone into something wild","rebel"],["Outside, looking at the sky","zen"]]},
   {t:"Pick a vibe.",o:[["Neon & bass","nightowl"],["Paint & paper","creative"],["Forest & fog","explorer"],["Candles & quiet","zen"]]},
   {t:"Your phone wallpaper is…",o:[["A place I want to go","explorer"],["Something I made","creative"],["Pure black, mysterious","rebel"],["Soft clouds, pastel everything","dreamer"]]},
   {t:"People describe you as…",o:[["Unpredictable","rebel"],["Imaginative","dreamer"],["Calm","zen"],["Up for anything","explorer"]]},
   {t:"Pick a motto.",o:[["“Why not?”","rebel"],["“Let's get lost.”","explorer"],["“Go make something.”","creative"],["“Just breathe.”","zen"]]}
  ],
  r:{
   explorer:{n:"Explorer Odd",tg:"Always a little lost, on purpose.",bl:"You'd rather take the weird turn than the safe one. New places, new snacks, new trouble — you're in.",tr:["Curious","Restless","Maps optional"]},
   creative:{n:"Creative Odd",tg:"Powered by coffee and half-finished ideas.",bl:"Your brain never closes the tabs. You make things, remix things, and you're three projects deep right now.",tr:["Maker","Caffeinated","Idea machine"]},
   nightowl:{n:"Night Owl Odd",tg:"The best ideas arrive at 2am. With pizza.",bl:"The world gets quiet and you get loud. Midnight is your golden hour — fridge-lit and unbothered.",tr:["Nocturnal","Snack-powered","2am philosopher"]},
   zen:{n:"Zen Odd",tg:"Stops to smell exactly one flower.",bl:"Calm in the chaos. You move slow on purpose and somehow always end up fine. Suspiciously fine.",tr:["Calm","Present","Unbothered"]},
   rebel:{n:"Rebel Odd",tg:"“Why not?” is a full personality.",bl:"Rules are more like… suggestions. You're the friend who turns a normal Tuesday into a story.",tr:["Bold","Rule-allergic","Loud underwear"]},
   dreamer:{n:"Dreamer Odd",tg:"Head in the clouds, feet on the sofa.",bl:"Soft, imaginative, a little far away. You feel everything and your inner world is genuinely a nice place.",tr:["Soft","Imaginative","Cozy-core"]}
  }
 },
 tr:{
  ui:{home:"← Ana sayfa",eyebrow:"Oddvi Testi",intro:"On kısa soru. Sonunda sana çok özel bir tuhaflık türü — üstüne saklaman için bir duvar kağıdı, profil resmi ve kendi Odd kartın.",start:"Teste başla →",qcount:"Soru {n} / {total}",back:"← Geri",youAre:"Sen…",dlTitle:"Odd'unu yanına al",dlHint:"Sonucuna özel üç ücretsiz indirme.",dlWallpaper:"Telefon duvar kağıdı",dlProfile:"Profil resmi",dlCard:"Odd kartı",download:"İndir",building:"Hazırlanıyor…",blocked:"Önizlemede kısıtlı — canlı sitede çalışır",retake:"↺ Testi tekrar çöz",updates:"Lansman haberlerini al →"},
  q:[
   {t:"Hafta sonu. Plan ne?",o:[["Evde kıvrılıp şahane bir hiçlik yapmak","dreamer"],["Hiç gitmediğim bir yere gitmek","explorer"],["Doğada kaybolmak","zen"],["Arkadaşlarla gün doğana kadar dışarıda","nightowl"]]},
   {t:"İdeal gecen nasıl?",o:[["Gürültülü ve geç bir yerde","nightowl"],["Elimle bir şey yaparken","creative"],["Tam sessizlikte yıldızları izlerken","dreamer"],["Yapmamam gereken bir şeyi yaparken","rebel"]]},
   {t:"Gece 2 atıştırması seç.",o:[["Soğuk pizza, utanmadan","nightowl"],["En maceralı olan ne varsa","explorer"],["Aslında bitki çayı","zen"],["Kalan pastanın hepsi","rebel"]]},
   {t:"Odan/masan neye benziyor?",o:[["Projelerden oluşan düzenli bir kaos","creative"],["Haritalar, aletler, hatıralar","explorer"],["Minimal, sakin, ferah","zen"],["Peri ışıkları ve yastık kalesi","dreamer"]]},
   {t:"Bir süper güç seç.",o:[["Her yere anında ışınlanmak","explorer"],["Her fikri gerçek yapmak","creative"],["Hiç uyumaya ihtiyaç duymamak","nightowl"],["Kalıcı iç huzur","zen"]]},
   {t:"Partide sen…",o:[["Işıklar yanınca hâlâ dans ediyorsun","nightowl"],["Tek bir güzel sohbete dalmışsın","dreamer"],["Herkesi çılgın bir şeye ikna ediyorsun","rebel"],["Dışarıda, gökyüzüne bakıyorsun","zen"]]},
   {t:"Bir hava seç.",o:[["Neon & bas","nightowl"],["Boya & kâğıt","creative"],["Orman & sis","explorer"],["Mum & sessizlik","zen"]]},
   {t:"Telefon duvar kağıdın…",o:[["Gitmek istediğim bir yer","explorer"],["Kendi yaptığım bir şey","creative"],["Saf siyah, gizemli","rebel"],["Yumuşak bulutlar, pastel her şey","dreamer"]]},
   {t:"İnsanlar seni şöyle tanımlar…",o:[["Öngörülemez","rebel"],["Hayal gücü kuvvetli","dreamer"],["Sakin","zen"],["Her şeye varım","explorer"]]},
   {t:"Bir slogan seç.",o:[["“Neden olmasın?”","rebel"],["“Hadi kaybolalım.”","explorer"],["“Git bir şey yap.”","creative"],["“Sadece nefes al.”","zen"]]}
  ],
  r:{
   explorer:{n:"Kaşif Odd",tg:"Hep biraz kayıp, bilerek.",bl:"Güvenli yol yerine tuhaf yolu seçersin. Yeni yerler, yeni atıştırmalıklar, yeni belalar — varsın.",tr:["Meraklı","Yerinde duramaz","Harita opsiyonel"]},
   creative:{n:"Yaratıcı Odd",tg:"Kahve ve yarım kalmış fikirlerle çalışır.",bl:"Beynin sekmeleri hiç kapatmaz. Bir şeyler yapar, remixlersin ve şu an üç projenin içindesin.",tr:["Üretken","Kafeinli","Fikir makinesi"]},
   nightowl:{n:"Gece Kuşu Odd",tg:"En iyi fikirler gece 2'de gelir. Pizzayla.",bl:"Dünya susunca sen yükselirsin. Gece yarısı senin altın saatin — buzdolabı ışığında, takılmadan.",tr:["Gece kuşu","Atıştırma gücüyle","Gece 2 filozofu"]},
   zen:{n:"Zen Odd",tg:"Tam olarak tek bir çiçeği koklamak için durur.",bl:"Kaosun içinde sakin. Bilerek yavaş hareket eder ve nedense hep iyi olursun. Şüpheli derecede iyi.",tr:["Sakin","Anda","Takılmayan"]},
   rebel:{n:"Asi Odd",tg:"“Neden olmasın?” başlı başına bir kişilik.",bl:"Kurallar daha çok… öneri gibi. Sıradan bir salıyı bir hikâyeye çeviren arkadaşsın.",tr:["Cesur","Kural alerjisi","Renkli iç çamaşırı"]},
   dreamer:{n:"Hayalci Odd",tg:"Başı bulutlarda, ayakları kanepede.",bl:"Yumuşak, hayalperest, biraz uzaklarda. Her şeyi hissedersin ve iç dünyan gerçekten güzel bir yer.",tr:["Yumuşak","Hayalperest","Konfor-core"]}
  }
 },
 de:{
  ui:{home:"← Zur Startseite",eyebrow:"Der Oddvi-Test",intro:"Zehn kurze Fragen. Am Ende eine ganz bestimmte Art von seltsam — plus ein Wallpaper, ein Profilbild und deine eigene Odd-Karte.",start:"Test starten →",qcount:"Frage {n} von {total}",back:"← Zurück",youAre:"Du bist…",dlTitle:"Nimm dein Odd mit",dlHint:"Drei kostenlose Downloads, nur für dein Ergebnis.",dlWallpaper:"Handy-Wallpaper",dlProfile:"Profilbild",dlCard:"Odd-Karte",download:"Herunterladen",building:"Wird erstellt…",blocked:"Vorschau hier eingeschränkt — funktioniert auf der Live-Seite",retake:"↺ Test wiederholen",updates:"Launch-Updates erhalten →"},
  q:[
   {t:"Wochenende. Der Plan?",o:[["Es mir zu Hause gemütlich machen und herrlich nichts tun","dreamer"],["Irgendwohin, wo ich noch nie war","explorer"],["In der Natur verschwinden","zen"],["Mit Freunden bis Sonnenaufgang unterwegs","nightowl"]]},
   {t:"Deine ideale Nacht?",o:[["Irgendwo laut und spät","nightowl"],["Etwas mit den Händen machen","creative"],["Sterne gucken in völliger Stille","dreamer"],["Etwas tun, das ich wohl nicht sollte","rebel"]]},
   {t:"Wähl einen 2-Uhr-Snack.",o:[["Kalte Pizza, ohne Reue","nightowl"],["Was auch immer am abenteuerlichsten ist","explorer"],["Eigentlich Kräutertee","zen"],["Den Rest vom Kuchen. Alles.","rebel"]]},
   {t:"Dein Zimmer/Schreibtisch sieht aus wie…",o:[["Geordnetes Chaos aus Projekten","creative"],["Karten, Gadgets und Souvenirs","explorer"],["Minimalistisch, ruhig, klar","zen"],["Lichterketten und eine Kissenburg","dreamer"]]},
   {t:"Wähl eine Superkraft.",o:[["Mich überallhin teleportieren, sofort","explorer"],["Jede Idee real machen","creative"],["Nie schlafen müssen","nightowl"],["Dauerhafter innerer Frieden","zen"]]},
   {t:"Auf einer Party bist du…",o:[["Tanzt noch, wenn das Licht angeht","nightowl"],["Tief in einem guten Gespräch","dreamer"],["Überredest alle zu etwas Verrücktem","rebel"],["Draußen, schaust in den Himmel","zen"]]},
   {t:"Wähl eine Stimmung.",o:[["Neon & Bass","nightowl"],["Farbe & Papier","creative"],["Wald & Nebel","explorer"],["Kerzen & Stille","zen"]]},
   {t:"Dein Handy-Hintergrund ist…",o:[["Ein Ort, an den ich will","explorer"],["Etwas, das ich gemacht habe","creative"],["Tiefschwarz, geheimnisvoll","rebel"],["Weiche Wolken, alles pastell","dreamer"]]},
   {t:"Andere beschreiben dich als…",o:[["Unberechenbar","rebel"],["Fantasievoll","dreamer"],["Ruhig","zen"],["Für alles zu haben","explorer"]]},
   {t:"Wähl ein Motto.",o:[["„Warum nicht?“","rebel"],["„Lass uns verloren gehen.“","explorer"],["„Mach was.“","creative"],["„Einfach atmen.“","zen"]]}
  ],
  r:{
   explorer:{n:"Entdecker-Odd",tg:"Immer ein bisschen verloren — absichtlich.",bl:"Du nimmst lieber die seltsame Abzweigung als die sichere. Neue Orte, neue Snacks, neuer Ärger — du bist dabei.",tr:["Neugierig","Rastlos","Karte optional"]},
   creative:{n:"Kreativ-Odd",tg:"Angetrieben von Kaffee und halbfertigen Ideen.",bl:"Dein Kopf schließt nie die Tabs. Du machst Dinge, mixt sie neu und steckst gerade in drei Projekten.",tr:["Macher","Koffeiniert","Ideenmaschine"]},
   nightowl:{n:"Nachteulen-Odd",tg:"Die besten Ideen kommen um 2 Uhr. Mit Pizza.",bl:"Wenn die Welt leise wird, drehst du auf. Mitternacht ist deine goldene Stunde — kühlschrankbeleuchtet und unbeeindruckt.",tr:["Nachtaktiv","Snack-betrieben","2-Uhr-Philosoph"]},
   zen:{n:"Zen-Odd",tg:"Hält an, um genau eine Blume zu riechen.",bl:"Ruhig im Chaos. Du bewegst dich absichtlich langsam und kommst irgendwie immer gut an. Verdächtig gut.",tr:["Ruhig","Im Moment","Unbeeindruckt"]},
   rebel:{n:"Rebell-Odd",tg:"„Warum nicht?“ ist eine ganze Persönlichkeit.",bl:"Regeln sind eher… Vorschläge. Du bist die Person, die aus einem normalen Dienstag eine Geschichte macht.",tr:["Mutig","Regel-allergisch","Laute Unterwäsche"]},
   dreamer:{n:"Träumer-Odd",tg:"Kopf in den Wolken, Füße auf dem Sofa.",bl:"Sanft, fantasievoll, ein bisschen weit weg. Du fühlst alles, und deine innere Welt ist echt ein schöner Ort.",tr:["Sanft","Fantasievoll","Cozy-core"]}
  }
 },
 fr:{
  ui:{home:"← Accueil",eyebrow:"Le test Oddvi",intro:"Dix questions rapides. Une forme de bizarrerie bien précise à la fin — plus un fond d'écran, une photo de profil et ta propre carte Odd.",start:"Commencer le test →",qcount:"Question {n} sur {total}",back:"← Retour",youAre:"Tu es…",dlTitle:"Emporte ton Odd",dlHint:"Trois téléchargements gratuits, faits pour ton résultat.",dlWallpaper:"Fond d'écran",dlProfile:"Photo de profil",dlCard:"Carte Odd",download:"Télécharger",building:"Création…",blocked:"Aperçu limité ici — fonctionne sur le site en ligne",retake:"↺ Refaire le test",updates:"Recevoir les actus du lancement →"},
  q:[
   {t:"C'est le week-end. Le programme ?",o:[["Rester au chaud chez moi et ne rien faire, divinement","dreamer"],["Aller quelque part où je ne suis jamais allé","explorer"],["Disparaître dans la nature","zen"],["Dehors avec des amis jusqu'au lever du soleil","nightowl"]]},
   {t:"Ta nuit idéale ?",o:[["Quelque part, fort et tard","nightowl"],["Fabriquer quelque chose de mes mains","creative"],["Regarder les étoiles dans le silence total","dreamer"],["Faire un truc que je ne devrais sans doute pas","rebel"]]},
   {t:"Choisis un snack de 2 h du matin.",o:[["Pizza froide, sans honte","nightowl"],["Ce qu'il y a de plus aventureux","explorer"],["Une tisane, en fait","zen"],["Le reste du gâteau. En entier.","rebel"]]},
   {t:"Ta chambre/ton bureau ressemble à…",o:[["Un chaos organisé de projets","creative"],["Cartes, gadgets et souvenirs","explorer"],["Minimal, calme, clair","zen"],["Guirlandes et fort en coussins","dreamer"]]},
   {t:"Choisis un super-pouvoir.",o:[["Me téléporter partout, instantanément","explorer"],["Rendre réelle n'importe quelle idée","creative"],["Ne jamais avoir besoin de dormir","nightowl"],["La paix intérieure permanente","zen"]]},
   {t:"En soirée, tu es…",o:[["Encore en train de danser quand les lumières se rallument","nightowl"],["Plongé dans une bonne conversation","dreamer"],["En train de convaincre tout le monde de faire un truc fou","rebel"],["Dehors, à regarder le ciel","zen"]]},
   {t:"Choisis une ambiance.",o:[["Néon & basses","nightowl"],["Peinture & papier","creative"],["Forêt & brume","explorer"],["Bougies & silence","zen"]]},
   {t:"Ton fond d'écran, c'est…",o:[["Un endroit où je veux aller","explorer"],["Quelque chose que j'ai fait","creative"],["Noir profond, mystérieux","rebel"],["Nuages doux, tout en pastel","dreamer"]]},
   {t:"On te décrit comme…",o:[["Imprévisible","rebel"],["Imaginatif","dreamer"],["Calme","zen"],["Partant pour tout","explorer"]]},
   {t:"Choisis une devise.",o:[["« Pourquoi pas ? »","rebel"],["« Allons nous perdre. »","explorer"],["« Va créer un truc. »","creative"],["« Respire, c'est tout. »","zen"]]}
  ],
  r:{
   explorer:{n:"Explorateur Odd",tg:"Toujours un peu perdu, exprès.",bl:"Tu préfères le virage bizarre au virage sûr. Nouveaux lieux, nouveaux snacks, nouveaux ennuis — tu es partant.",tr:["Curieux","Jamais en place","Carte facultative"]},
   creative:{n:"Créatif Odd",tg:"Propulsé au café et aux idées à moitié finies.",bl:"Ton cerveau ne ferme jamais les onglets. Tu crées, tu remixes, et tu es déjà dans trois projets.",tr:["Créateur","Caféiné","Machine à idées"]},
   nightowl:{n:"Oiseau de Nuit Odd",tg:"Les meilleures idées arrivent à 2 h. Avec une pizza.",bl:"Quand le monde se tait, tu montes le son. Minuit, c'est ton heure de gloire — éclairé au frigo, tranquille.",tr:["Nocturne","Au carburant snack","Philosophe de 2 h"]},
   zen:{n:"Zen Odd",tg:"S'arrête pour sentir exactement une fleur.",bl:"Calme dans le chaos. Tu vas lentement exprès et, bizarrement, ça finit toujours bien. Suspectement bien.",tr:["Calme","Présent","Imperturbable"]},
   rebel:{n:"Rebelle Odd",tg:"« Pourquoi pas ? » est une personnalité à part entière.",bl:"Les règles, c'est plutôt… des suggestions. Tu es l'ami qui transforme un mardi banal en histoire.",tr:["Audacieux","Allergique aux règles","Sous-vêtements voyants"]},
   dreamer:{n:"Rêveur Odd",tg:"La tête dans les nuages, les pieds sur le canapé.",bl:"Doux, imaginatif, un peu ailleurs. Tu ressens tout, et ton monde intérieur est vraiment un bel endroit.",tr:["Doux","Imaginatif","Cocooning"]}
  }
 },
 hu:{
  ui:{home:"← Főoldal",eyebrow:"Az Oddvi-teszt",intro:"Tíz gyors kérdés. A végén egy nagyon konkrét furaság — plusz egy háttérkép, egy profilkép és a saját Odd-kártyád.",start:"Teszt indítása →",qcount:"{n}. kérdés / {total}",back:"← Vissza",youAre:"Te…",dlTitle:"Vidd magaddal az Oddod",dlHint:"Három ingyenes letöltés, kifejezetten az eredményedhez.",dlWallpaper:"Telefon háttérkép",dlProfile:"Profilkép",dlCard:"Odd-kártya",download:"Letöltés",building:"Készül…",blocked:"Az előnézet itt korlátozott — az élő oldalon működik",retake:"↺ Teszt újra",updates:"Hírek a megjelenésről →"},
  q:[
   {t:"Hétvége. Mi a terv?",o:[["Otthon összegömbölyödni és isteni semmittevés","dreamer"],["Elmenni valahova, ahol még sosem jártam","explorer"],["Eltűnni a természetben","zen"],["Barátokkal kint napfelkeltéig","nightowl"]]},
   {t:"Az ideális estéd?",o:[["Valahol hangosan és későig","nightowl"],["Kézzel csinálni valamit","creative"],["Csillagokat nézni teljes csendben","dreamer"],["Valami olyat csinálni, amit valószínűleg nem kéne","rebel"]]},
   {t:"Válassz egy hajnali nasit.",o:[["Hideg pizza, szégyen nélkül","nightowl"],["Ami a legkalandosabb","explorer"],["Igazából egy gyógytea","zen"],["A maradék süti. Az egész.","rebel"]]},
   {t:"A szobád/asztalod ilyen…",o:[["Projektek rendezett káosza","creative"],["Térképek, kütyük és szuvenírek","explorer"],["Minimál, nyugodt, tiszta","zen"],["Fényfüzér és párnavár","dreamer"]]},
   {t:"Válassz egy szupererőt.",o:[["Bárhova azonnal teleportálni","explorer"],["Bármilyen ötletet valóra váltani","creative"],["Sosem kell aludni","nightowl"],["Tartós belső béke","zen"]]},
   {t:"Egy buliban te…",o:[["Még táncolsz, amikor felkapcsolják a villanyt","nightowl"],["Elmélyülsz egy jó beszélgetésben","dreamer"],["Mindenkit rábeszélsz valami vadra","rebel"],["Kint vagy, az eget nézed","zen"]]},
   {t:"Válassz egy hangulatot.",o:[["Neon & basszus","nightowl"],["Festék & papír","creative"],["Erdő & köd","explorer"],["Gyertya & csend","zen"]]},
   {t:"A telefonod háttérképe…",o:[["Egy hely, ahová vágyom","explorer"],["Valami, amit én készítettem","creative"],["Mélyfekete, titokzatos","rebel"],["Lágy felhők, csupa pasztell","dreamer"]]},
   {t:"Mások így írnak le…",o:[["Kiszámíthatatlan","rebel"],["Fantáziadús","dreamer"],["Nyugodt","zen"],["Bármire kapható","explorer"]]},
   {t:"Válassz egy mottót.",o:[["„Miért is ne?”","rebel"],["„Tévedjünk el.”","explorer"],["„Menj, alkoss valamit.”","creative"],["„Csak lélegezz.”","zen"]]}
  ],
  r:{
   explorer:{n:"Felfedező Odd",tg:"Mindig kicsit eltévedve — szándékosan.",bl:"Inkább a furcsa kanyart választod, mint a biztosat. Új helyek, új nasik, új balhé — benne vagy.",tr:["Kíváncsi","Nyughatatlan","Térkép opcionális"]},
   creative:{n:"Kreatív Odd",tg:"Kávéval és félkész ötletekkel üzemel.",bl:"Az agyad sosem zárja be a füleket. Készítesz, remixelsz, és épp három projekt közepén jársz.",tr:["Alkotó","Koffeines","Ötletgyár"]},
   nightowl:{n:"Éjszakai Bagoly Odd",tg:"A legjobb ötletek hajnali 2-kor jönnek. Pizzával.",bl:"Amikor a világ elcsendesedik, te felpörögsz. Az éjfél a te aranyórád — hűtőfényben, lazán.",tr:["Éjszakai","Nasi-hajtású","Hajnali 2 filozófus"]},
   zen:{n:"Zen Odd",tg:"Megáll, hogy pontosan egy virágot megszagoljon.",bl:"Nyugodt a káoszban. Szándékosan lassan haladsz, és valahogy mindig jól végződik. Gyanúsan jól.",tr:["Nyugodt","Jelenlévő","Rendíthetetlen"]},
   rebel:{n:"Lázadó Odd",tg:"A „Miért is ne?” egy egész személyiség.",bl:"A szabályok inkább… javaslatok. Te vagy az a barát, aki egy hétköznapi keddből sztorit csinál.",tr:["Bátor","Szabály-allergiás","Feltűnő fehérnemű"]},
   dreamer:{n:"Álmodozó Odd",tg:"Fejjel a felhőkben, lábbal a kanapén.",bl:"Lágy, fantáziadús, kicsit máshol jár. Mindent átérzel, és a belső világod tényleg szép hely.",tr:["Lágy","Fantáziadús","Kuckó-core"]}
  }
 }
};

/* Yeni galeri görselleri için alt yazılar (5 dil) */
Object.assign(window.I18N.dict.en,{'cap.istanbul':"Platform 1. Wrong train, probably.",'cap.stayodd':"Stay odd. Obviously.",'cap.normal':"Normal is boring.",'cap.oddparty':"Odd party. BYO weird.",'cap.ukulele':"Writing a song no one requested.",'cap.mic':"Open mic, zero rehearsal.",'cap.receipt':"Reading the receipt. Regretting.",'cap.freedom':"5PM. Freedom time.",'cap.baking':"Step 4: call for pizza.",'cap.library':"Three books deep, finishing none.",'cap.veggies':"Eating healthy. Allegedly.",'cap.orb':"Consulting the orb."});
Object.assign(window.I18N.dict.tr,{'cap.istanbul':"1. Peron. Yanlış tren, muhtemelen.",'cap.stayodd':"Tuhaf kal. Belli ki.",'cap.normal':"Normal sıkıcı.",'cap.oddparty':"Odd parti. Tuhaflığını getir.",'cap.ukulele':"Kimsenin istemediği bir şarkı yazıyor.",'cap.mic':"Açık mikrofon, sıfır prova.",'cap.receipt':"Fişi okuyor. Pişman oluyor.",'cap.freedom':"17:00. Özgürlük vakti.",'cap.baking':"4. adım: pizza söyle.",'cap.library':"Üç kitaba dalmış, birini bitirmiyor.",'cap.veggies':"Sağlıklı besleniyor. Sözde.",'cap.orb':"Küreye danışıyor."});
Object.assign(window.I18N.dict.de,{'cap.istanbul':"Gleis 1. Wohl der falsche Zug.",'cap.stayodd':"Stay odd. Logisch.",'cap.normal':"Normal ist langweilig.",'cap.oddparty':"Odd-Party. Weirdness mitbringen.",'cap.ukulele':"Schreibt ein Lied, das keiner wollte.",'cap.mic':"Open Mic, null Proben.",'cap.receipt':"Liest den Kassenzettel. Bereut.",'cap.freedom':"17 Uhr. Feierabend.",'cap.baking':"Schritt 4: Pizza bestellen.",'cap.library':"Drei Bücher offen, keins zu Ende.",'cap.veggies':"Isst gesund. Angeblich.",'cap.orb':"Befragt die Kugel."});
Object.assign(window.I18N.dict.fr,{'cap.istanbul':"Quai 1. Mauvais train, sûrement.",'cap.stayodd':"Stay odd. Évidemment.",'cap.normal':"Le normal, c'est ennuyeux.",'cap.oddparty':"Odd party. Ramène ton grain de folie.",'cap.ukulele':"Écrit une chanson que personne n'a demandée.",'cap.mic':"Scène ouverte, zéro répétition.",'cap.receipt':"Lit le ticket. Le regrette.",'cap.freedom':"17 h. L'heure de la liberté.",'cap.baking':"Étape 4 : commander une pizza.",'cap.library':"Trois livres entamés, aucun fini.",'cap.veggies':"Mange sainement. Soi-disant.",'cap.orb':"Consulte la boule."});
Object.assign(window.I18N.dict.hu,{'cap.istanbul':"1-es vágány. Rossz vonat, valószínűleg.",'cap.stayodd':"Maradj odd. Nyilván.",'cap.normal':"A normális unalmas.",'cap.oddparty':"Odd buli. Hozd a furaságod.",'cap.ukulele':"Olyan dalt ír, amit senki sem kért.",'cap.mic':"Nyílt mikrofon, nulla próba.",'cap.receipt':"Olvassa a blokkot. Megbánja.",'cap.freedom':"17 óra. A szabadság ideje.",'cap.baking':"4. lépés: rendelj pizzát.",'cap.library':"Három könyv félbehagyva.",'cap.veggies':"Egészségesen eszik. Állítólag.",'cap.orb':"Megkérdezi a gömböt."});
