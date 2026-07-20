/* ============================================================
   ODDVI · Odd Machine
   A press-and-reveal toy: each press picks a random question +
   a matching random witty answer, avoiding the same question
   twice in a row. Self-contained 5-language content, separate
   from i18n-dict.js.
   ============================================================ */
(function () {
  var UI = {
    en: { kicker: "Interactive", heading: "Ask The Odd Machine", intro: "Press it. It spins. It tells the truth nobody asked for.", run: "🎲 Run The Odd Machine", again: "🎲 Run It Again", thinking: "Thinking" },
    tr: { kicker: "İnteraktif", heading: "Odd Machine'e Sor", intro: "Bas. Döner. Kimsenin istemediği gerçeği söyler.", run: "🎲 Odd Machine'i Çalıştır", again: "🎲 Tekrar Çalıştır", thinking: "Düşünüyor" },
    de: { kicker: "Interaktiv", heading: "Frag Die Odd Machine", intro: "Drück drauf. Es dreht sich. Es sagt die Wahrheit, die niemand wollte.", run: "🎲 Odd Machine Starten", again: "🎲 Nochmal", thinking: "Denkt nach" },
    fr: { kicker: "Interactif", heading: "Demande À La Odd Machine", intro: "Appuie. Ça tourne. Ça dit la vérité que personne n'a demandée.", run: "🎲 Lancer La Odd Machine", again: "🎲 Relancer", thinking: "Réflexion" },
    hu: { kicker: "Interaktív", heading: "Kérdezd Az Odd Machine-t", intro: "Nyomd meg. Pörög. Kimondja az igazságot, amit senki sem kért.", run: "🎲 Indítsd El Az Odd Machine-t", again: "🎲 Újra", thinking: "Gondolkodik" }
  };

  var PROMPTS = [
    {
      question: {
        en: "If your phone testified in court, who would it rat out first?",
        tr: "Telefonun mahkemede ifade verse, ilk kimi ele verirdi?",
        de: "Wenn dein Handy vor Gericht aussagen würde, wen würde es zuerst verraten?",
        fr: "Si ton téléphone témoignait au tribunal, qui dénoncerait-il en premier ?",
        hu: "Ha a telefonod tanúskodna a bíróságon, kit árulna el elsőként?"
      },
      answers: {
        en: ["That 3am call.", "The 47 messages marked 'seen' and never answered.", "Looking up the same person six times in one day.", "The screenshot you deleted but never forgot.", "The 12th order you swore was 'the last one.'", "Being on WhatsApp during the meeting.", "How much faster you kill the alarm than you answer emails.", "The text sent at 6am, regretted by 9.", "Not closing TikTok even at 1% battery.", "'Just a sec' turning into 40 minutes.", "How many times the screen cracked, and you still haven't fixed it.", "Taking the same photo 30 times and liking none of them.", "Texting 'I'll wake up early tomorrow' at 2am.", "Every 'typing...' that quietly gave up — it remembers them all.", "Never turning off night mode, not even at noon.", "The real, actual length of 'one second.'", "Every 'I'll call you back' that never happened."],
        tr: ["Gece 3'teki o aramayı.", "\"Görüldü\" yazıp cevap vermediğin 47 mesajı.", "Aynı kişiyi bir günde 6 kere aratmanı.", "Sildiğin ama hafızanda kalan o ekran görüntüsünü.", "\"Son kez\" diyerek verdiğin 12. siparişi.", "Toplantıdayken WhatsApp'ta olduğunu.", "Alarm kapatma hızını, e-posta cevap hızıyla kıyaslayarak.", "Sabah 6'da atıp sabah 9'da pişman olduğun o mesajı.", "Şarj %1'deyken bile TikTok'u kapatmadığını.", "\"Bir dakika bakarım\" deyip 40 dakika sonra çıktığını.", "Ekranın kaç kere kırıldığını, hâlâ değiştirmediğini.", "Aynı fotoğrafı 30 kere çekip hiçbirini beğenmediğini.", "Sabahın 2'sinde \"yarın erken kalkacağım\" yazdığını.", "Kimin \"yazıyor...\" yazıp sonra vazgeçtiğini — hepsini biliyor.", "Gece modunu hiç kapatmadığını, gündüz bile.", "\"Bir saniye\" cümlesinin gerçek süresini.", "Kaç kere \"az sonra ararım\" deyip aramadığını."],
        de: ["Der Anruf um 3 Uhr nachts.", "Die 47 Nachrichten, 'gelesen' markiert, nie beantwortet.", "Dieselbe Person sechsmal an einem Tag gesucht.", "Der Screenshot, den du gelöscht, aber nie vergessen hast.", "Die 12. Bestellung, die 'die letzte' sein sollte.", "Im Meeting bei WhatsApp gewesen zu sein.", "Wie viel schneller du den Wecker ausschaltest als E-Mails beantwortest.", "Die Nachricht um 6 Uhr geschickt, um 9 Uhr bereut.", "TikTok nicht mal bei 1% Akku geschlossen.", "'Nur kurz schauen' wurde zu 40 Minuten.", "Wie oft der Bildschirm zersprungen ist, und du hast ihn immer noch nicht reparieren lassen.", "Dasselbe Foto 30-mal gemacht und keins gemocht.", "Um 2 Uhr nachts 'ich steh morgen früh auf' geschrieben.", "Jedes 'schreibt...', das leise aufgegeben hat — es erinnert sich an alle.", "Nachtmodus nie ausgeschaltet, nicht mal mittags.", "Die wahre Dauer von 'eine Sekunde'.", "Jedes 'ich ruf zurück', das nie passiert ist."],
        fr: ["Cet appel à 3h du matin.", "Les 47 messages marqués 'lu', jamais répondus.", "Avoir cherché la même personne six fois en un jour.", "La capture d'écran supprimée mais jamais oubliée.", "La 12e commande censée être 'la dernière'.", "Être sur WhatsApp pendant la réunion.", "À quelle vitesse tu coupes l'alarme comparé à répondre aux emails.", "Le texto envoyé à 6h, regretté à 9h.", "Ne pas fermer TikTok même à 1% de batterie.", "'Juste une seconde' devenu 40 minutes.", "Combien de fois l'écran s'est fissuré, toujours pas réparé.", "Prendre la même photo 30 fois et n'en aimer aucune.", "Écrire 'je me lève tôt demain' à 2h du matin.", "Chaque '...' qui s'est éteint en silence — il se souvient de tous.", "Le mode nuit jamais désactivé, même en plein midi.", "La vraie durée d'une 'seconde'.", "Chaque 'je te rappelle' qui n'a jamais eu lieu."],
        hu: ["Az a hajnali 3-kori hívás.", "A 47 üzenet, 'olvasva' jelölve, sosem megválaszolva.", "Ugyanazt a személyt hatszor megkeresni egy nap alatt.", "A képernyőkép, amit töröltél, de sosem felejtettél el.", "A 12. rendelés, ami 'az utolsó' lett volna.", "A WhatsAppon lenni a megbeszélés alatt.", "Mennyivel gyorsabban kapcsolod ki az ébresztőt, mint ahogy emailre válaszolsz.", "A hajnali 6-kor küldött üzenet, ami 9-re megbánva.", "A TikTokot még 1%-os akkumulátornál sem zárod be.", "A 'csak egy pillanat' negyven perccé vált.", "Hányszor repedt meg a képernyő, és még mindig nem javíttattad meg.", "Ugyanazt a fotót 30-szor lefotózni, és egyiket sem szeretni.", "Hajnali 2-kor azt írni: 'holnap korán kelek'.", "Minden '...gépel', ami csendben feladta — mindre emlékszik.", "Az éjszakai mód sosincs kikapcsolva, még délben sem.", "Az 'egy másodperc' valódi hossza.", "Minden 'visszahívlak', ami sosem történt meg."]
      }
    },
    {
      question: {
        en: "If your search history could talk, what would it confess first?",
        tr: "Google arama geçmişin konuşsa, ilk ne itiraf ederdi?",
        de: "Wenn deine Suchverläufe sprechen könnten, was würden sie zuerst gestehen?",
        fr: "Si ton historique de recherche pouvait parler, qu'avouerait-il en premier ?",
        hu: "Ha a keresési előzményeid megszólalnának, mit vallanának be először?"
      },
      answers: {
        en: ["That weird question you typed at 2am.", "Searching the same restaurant for the 40th time, still undecided.", "Every search that started with 'is it normal to...'", "Looking up the same word's meaning for the fifth time.", "Whether you've searched your own name (you have).", "The late-night searches starting with 'how to get over...'", "Checking the same flight price 12 times.", "Health searches swinging between 'is this normal' and 'is this an emergency.'", "Re-searching the item that's been in your cart for 3 weeks.", "Searching spoilers before finishing the finale.", "Searching 'how to be more productive' and immediately watching a video instead.", "Asking the same question three different ways and getting the same answer.", "Midnight searches about 'what should be accomplished by this age.'", "Reading 50 reviews before buying something and still not deciding.", "The morning searches that start with 'why did I do that.'"],
        tr: ["Saat 2'de yazdığın o garip soruyu.", "Aynı restoranı 40. kez aratmanı, hâlâ karar veremediğini.", "\"Normal mi bu\" ile başlayan her aramayı.", "Bir kelimenin anlamını beşinci kez aratman.", "Kendi adını aratıp aratmadığını (aratmışsın).", "\"Nasıl unutulur\" ile başlayan gece aramalarını.", "Aynı uçuşu 12 kere fiyat kontrol etmeni.", "\"Bu normal mi\" ile \"acil mi\" arasında gidip gelen sağlık aramalarını.", "Alışveriş sepetinde 3 hafta bekleyen ürünü tekrar tekrar aratman.", "Bir dizinin finalini izlemeden spoiler aratman.", "\"Nasıl daha üretken olunur\" aratıp hemen ardından video izlemeye geçmeni.", "Aynı soruyu üç farklı şekilde sorup hep aynı cevabı almanı.", "Gece yarısı \"kaç yaşında ne yapılmış olmalı\" aramalarını.", "Bir şeyi satın almadan önce 50 yorum okuyup yine de kararsız kalmanı.", "\"Bunu neden yaptım\" ile başlayan sabah aramalarını."],
        de: ["Diese seltsame Frage, die du um 2 Uhr nachts getippt hast.", "Dasselbe Restaurant zum 40. Mal gesucht, immer noch unentschlossen.", "Jede Suche, die mit 'ist es normal, dass...' begann.", "Die Bedeutung desselben Wortes zum fünften Mal nachgeschlagen.", "Ob du deinen eigenen Namen gesucht hast (hast du).", "Die nächtlichen Suchen, die mit 'wie überwinde ich...' beginnen.", "Denselben Flugpreis 12-mal gecheckt.", "Gesundheitssuchen, die zwischen 'ist das normal' und 'ist das ein Notfall' schwanken.", "Den Artikel, der seit 3 Wochen im Warenkorb liegt, erneut gesucht.", "Spoiler gesucht, bevor du das Finale gesehen hast.", "'Wie werde ich produktiver' gesucht und sofort stattdessen ein Video geschaut.", "Dieselbe Frage dreimal anders gestellt und immer dieselbe Antwort bekommen.", "Mitternächtliche Suchen zu 'was man in diesem Alter erreicht haben sollte.'", "50 Bewertungen gelesen, bevor du etwas gekauft hast, und immer noch unentschlossen.", "Die morgendlichen Suchen, die mit 'warum habe ich das getan' beginnen."],
        fr: ["Cette question bizarre tapée à 2h du matin.", "Chercher le même restaurant pour la 40e fois, toujours indécis.", "Chaque recherche qui commence par 'est-ce normal que...'", "Chercher le sens du même mot pour la cinquième fois.", "Avoir cherché ton propre nom (tu l'as fait).", "Les recherches nocturnes qui commencent par 'comment oublier...'", "Vérifier le même prix de vol 12 fois.", "Les recherches santé qui oscillent entre 'est-ce normal' et 'est-ce urgent'.", "Rechercher encore l'article resté 3 semaines dans le panier.", "Chercher des spoilers avant de finir la saison.", "Chercher 'comment être plus productif' et regarder une vidéo à la place aussitôt.", "Poser la même question trois fois différemment et obtenir la même réponse.", "Les recherches de minuit sur 'ce qu'on devrait avoir accompli à cet âge'.", "Lire 50 avis avant d'acheter et rester quand même indécis.", "Les recherches du matin qui commencent par 'pourquoi j'ai fait ça'."],
        hu: ["Az a fura kérdés, amit hajnali 2-kor gépeltél be.", "Ugyanazt az éttermet 40. alkalommal keresni, még mindig döntésképtelenül.", "Minden keresés, ami úgy kezdődött: 'normális, hogy...'", "Ugyanannak a szónak a jelentését ötödször megkeresni.", "Hogy megkerested-e a saját nevedet (igen, megtetted).", "Az éjszakai keresések, amik úgy kezdődnek: 'hogyan felejtsek el...'", "Ugyanazt a repülőjegyárat 12-szer ellenőrizni.", "Az egészségügyi keresések, amik 'ez normális' és 'ez sürgős' között ingadoznak.", "Újra megkeresni azt a terméket, ami 3 hete a kosárban van.", "Spoilert keresni a finálé megnézése előtt.", "'Hogyan legyek produktívabb' keresése után rögtön videót nézni helyette.", "Ugyanazt a kérdést háromféleképp feltenni, és mindig ugyanazt a választ kapni.", "Éjféli keresések arról, 'mit kellene elérni ebben a korban'.", "50 értékelést elolvasni vásárlás előtt, és még mindig döntésképtelennek lenni.", "A reggeli keresések, amik úgy kezdődnek: 'miért csináltam ezt'."]
      }
    },
    {
      question: {
        en: "If your alarm clock could make a deal with you, what would it want?",
        tr: "Sabah alarmın seninle bir anlaşma yapabilse, ne isterdi?",
        de: "Wenn dein Wecker einen Deal mit dir machen könnte, was würde er wollen?",
        fr: "Si ton réveil pouvait passer un marché avec toi, que voudrait-il ?",
        hu: "Ha az ébresztőórád alkut köthetne veled, mit akarna?"
      },
      answers: {
        en: ["The clause that says 'take me seriously for once.'", "The official retirement of the snooze button.", "A permanent end to the '5 more minutes' lie.", "A notarized promise to get up on the first ring.", "The right to veto being moved to another room.", "Being touched to actually get up, not just to lower the volume.", "'This is the last snooze' no longer being accepted as valid.", "You knowing it's not sick of its own sound — you are.", "An apology for failing to wake you, not for waking you.", "The right to run on weekends too (never exercised).", "'Today will be different' being said every morning and meaning nothing.", "Gratitude, as long as it isn't muted.", "An actual awakening, not just opening your eyes."],
        tr: ["\"Beni artık ciddiye al\" maddesi.", "Erteleme tuşunun resmi olarak emekli edilmesi.", "\"5 dakika\" yalanına sonsuza dek son verilmesi.", "İlk çalışta kalkma sözü, noter onaylı.", "Telefonun diğer odaya taşınmasına itiraz etmeme hakkı.", "Sesini kısmak için değil, gerçekten kalkmak için dokunulması.", "\"Bu son erteleme\" cümlesinin artık kabul edilmemesi.", "Kendi sesinden bıkmadığını bilmesi — asıl bıkan sensin.", "Uyandırdığı için değil, uyandıramadığı için özür dilemen.", "Hafta sonu da aynı saatte çalışma hakkı (asla kullanılmayan).", "\"Bugün farklı olacak\" cümlesinin her sabah tekrar edilmesi ama hiç gerçekleşmemesi.", "Sessize alınmadığı sürece minnettar olman.", "Gerçek bir uyanışın, sadece gözünü açmanın değil."],
        de: ["Die Klausel: 'nimm mich endlich mal ernst.'", "Die offizielle Rente für den Schlummer-Knopf.", "Ein endgültiges Ende der 'noch 5 Minuten'-Lüge.", "Ein notariell beglaubigtes Versprechen, beim ersten Klingeln aufzustehen.", "Das Vetorecht, nicht in ein anderes Zimmer verbannt zu werden.", "Berührt zu werden, um wirklich aufzustehen, nicht nur um leiser zu sein.", "'Das ist der letzte Schlummer' wird nicht mehr akzeptiert.", "Dass du weißt, es ist nicht genervt von seinem eigenen Ton — du bist es.", "Eine Entschuldigung dafür, dich nicht geweckt zu haben, nicht dafür, dass er's tat.", "Das Recht, auch am Wochenende zu klingeln (nie genutzt).", "'Heute wird anders' wird jeden Morgen gesagt und bedeutet nichts.", "Dankbarkeit, solange er nicht stummgeschaltet wird.", "Ein echtes Erwachen, nicht nur offene Augen."],
        fr: ["La clause : 'prends-moi enfin au sérieux.'", "La retraite officielle du bouton snooze.", "Une fin définitive au mensonge des '5 minutes de plus'.", "Une promesse notariée de te lever à la première sonnerie.", "Le droit de veto contre le fait d'être déplacé dans une autre pièce.", "Être touché pour vraiment se lever, pas juste pour baisser le volume.", "'C'est le dernier snooze' ne plus être accepté comme valide.", "Que tu saches qu'il n'en a pas marre de son propre son — c'est toi.", "Des excuses pour ne pas t'avoir réveillé, pas pour t'avoir réveillé.", "Le droit de sonner le week-end aussi (jamais utilisé).", "'Aujourd'hui sera différent' dit chaque matin et qui ne veut jamais rien dire.", "De la gratitude, tant qu'il n'est pas coupé.", "Un vrai réveil, pas juste ouvrir les yeux."],
        hu: ["A záradék: 'egyszer végre vegyél komolyan.'", "A szundi gomb hivatalos nyugdíjazása.", "Az '5 perc még' hazugság végleges vége.", "Közjegyzői ígéret, hogy első csörgésre felkelsz.", "A vétójog, hogy ne vigyenek át egy másik szobába.", "Az, hogy azért nyúlnak hozzá, hogy tényleg felkeljenek, ne csak halkítsanak.", "Az 'ez az utolsó szundi' többé ne legyen elfogadva.", "Hogy tudd: nem az ő saját hangjától fárad — te vagy az.", "Bocsánatkérés azért, mert nem tudott felébreszteni, nem azért, mert felébresztett.", "A jog, hogy hétvégén is szóljon (sosem használva).", "A 'ma más lesz' minden reggel elhangzik, és semmit sem jelent.", "Hála, amíg nincs elnémítva.", "Egy valódi ébredés, nem csak a szemed kinyitása."]
      }
    },
    {
      question: {
        en: "If your bank account left you a voice message, what would it say?",
        tr: "Banka hesabın sana sesli mesaj bıraksa, ne derdi?",
        de: "Wenn dein Bankkonto dir eine Sprachnachricht hinterlassen würde, was würde es sagen?",
        fr: "Si ton compte bancaire te laissait un message vocal, que dirait-il ?",
        hu: "Ha a bankszámlád hangüzenetet hagyna neked, mit mondana?"
      },
      answers: {
        en: ["I know about this month's 'just browsing' lie.", "Your coffee spending stopped being an expense and became a tradition.", "'I'll buy it on sale' has never once made you richer.", "Don't forget me the day after payday.", "I counted your subscriptions. You didn't.", "The emergency fund is called 'emergency' but gets spent like it isn't.", "That item sitting in your cart has been 'thinking about it' for three weeks.", "End-of-month math never adds up, same surprise every time.", "Should I count how many times you said 'this is the last purchase'?", "Small purchases hurt more than big ones, you know that.", "You downloaded a budgeting app. Used it for three days.", "Decisions made late at night always turn out expensive."],
        tr: ["Bu ayki \"sadece bakıyorum\" yalanını biliyorum.", "Kahve harcamaların artık bir gider kalemi, bir gelenek değil.", "\"İndirimdeyken alayım\" cümlesi seni hiç zengin etmedi.", "Maaş gününün ertesi günü beni unutma.", "Abonelik sayını saydım, sen saymadın.", "Acil durum fonunun adı \"acil\" ama hiç acil değilmiş gibi harcanıyor.", "Sepette bekleyen o ürün, üç haftadır \"düşünüyorum\" aşamasında.", "Ay sonu matematiği hiç tutmuyor, her ay aynı sürpriz.", "\"Bu son alışverişim\" cümlesini kaç kere söyledin, sayayım mı?", "Küçük harcamalar büyük harcamalardan daha çok can yakıyor, biliyorsun.", "Bütçe uygulaması indirdin, üç gün kullandın.", "Gece geç saatte verilen kararlar hep pahalıya patlıyor."],
        de: ["Ich kenne die 'nur mal schauen'-Lüge diesen Monat.", "Deine Kaffeeausgaben sind keine Ausgabe mehr, sondern eine Tradition.", "'Ich kauf's im Sale' hat dich noch nie reicher gemacht.", "Vergiss mich nicht am Tag nach dem Gehalt.", "Ich hab deine Abos gezählt. Du nicht.", "Der Notfallfonds heißt 'Notfall', wird aber ausgegeben, als wäre er keiner.", "Der Artikel im Warenkorb 'überlegt' seit drei Wochen.", "Die Monatsend-Mathe geht nie auf, jedes Mal dieselbe Überraschung.", "Soll ich zählen, wie oft du 'das ist der letzte Kauf' gesagt hast?", "Kleine Käufe tun mehr weh als große, das weißt du.", "Du hast eine Budget-App runtergeladen. Drei Tage benutzt.", "Späte Entscheidungen sind immer die teuren."],
        fr: ["Je connais le mensonge du 'je regarde juste' de ce mois-ci.", "Tes dépenses en café ne sont plus une dépense, c'est devenu une tradition.", "'Je l'achète en solde' ne t'a jamais rendu plus riche.", "Ne m'oublie pas le lendemain de la paie.", "J'ai compté tes abonnements. Pas toi.", "Le fonds d'urgence s'appelle 'urgence' mais est dépensé comme si ce n'en était pas une.", "Cet article dans ton panier 'réfléchit' depuis trois semaines.", "Les calculs de fin de mois ne tombent jamais juste, même surprise à chaque fois.", "Je compte combien de fois t'as dit 'c'est mon dernier achat' ?", "Les petits achats font plus mal que les gros, tu le sais.", "T'as téléchargé une appli de budget. Utilisée trois jours.", "Les décisions prises tard le soir finissent toujours chères."],
        hu: ["Tudok az e havi 'csak nézelődöm' hazugságról.", "A kávéra költött pénzed már nem kiadás, hanem hagyomány.", "A 'majd akcióban veszem meg' sosem tett gazdagabbá.", "Ne felejts el a fizetés utáni napon.", "Megszámoltam az előfizetéseidet. Te nem.", "A vészhelyzeti alapot 'vészhelyzetinek' hívják, de nem úgy költöd.", "Az a termék a kosaradban három hete 'gondolkodik'.", "A hónap végi matek sosem jön ki, mindig ugyanaz a meglepetés.", "Számoljam, hányszor mondtad, hogy 'ez az utolsó vásárlás'?", "A kis vásárlások jobban fájnak, mint a nagyok, tudod te is.", "Letöltöttél egy költségvetés-appot. Három napig használtad.", "A késő esti döntések mindig drágák."]
      }
    },
    {
      question: {
        en: "If your fridge could talk, what would it complain about first?",
        tr: "Buzdolabın konuşabilse, ilk ne şikayet ederdi?",
        de: "Wenn dein Kühlschrank sprechen könnte, worüber würde er sich zuerst beschweren?",
        fr: "Si ton frigo pouvait parler, de quoi se plaindrait-il en premier ?",
        hu: "Ha a hűtőd tudna beszélni, miről panaszkodna először?"
      },
      answers: {
        en: ["How many weeks that vegetable has been in there.", "Opening the door and closing it without taking anything.", "The ingredient you said you'd cook 'tomorrow' has expired.", "Opening it at midnight just to look.", "Putting the same leftovers in twice and forgetting both times.", "The 'healthy' groceries you bought and never touched.", "The takeout containers that have earned their own shelf.", "Its museum collection of half-used sauces.", "The 'I won't throw this out, might need it' item that's now growing mold.", "Being your emotional support door handle during stress.", "Half its contents currently having an identity crisis."],
        tr: ["İçindeki o sebzenin kaç haftadır orada olduğunu.", "Kapıyı açıp hiçbir şey almadan kapatmanı.", "\"Yarın pişiririm\" dediğin malzemenin artık tarih olduğunu.", "Gece yarısı ışığını sadece bakmak için açtığını.", "Aynı kaba iki kere aynı yemeği koyup unuttuğunu.", "Marketten alıp hiç dokunmadığın \"sağlıklı\" ürünleri.", "Sipariş yemek kutularının, kendi rafını hak ettiğini.", "İçindeki soslar müzesini.", "\"Bunu atmayayım, belki lazım olur\" dediğin şeyin küflendiğini.", "Kapı kolunun, senin stres anındaki sığınağın olduğunu.", "İçindekilerin yarısının artık bir kimlik krizinde olduğunu."],
        de: ["Wie viele Wochen dieses Gemüse schon drin liegt.", "Die Tür öffnen und wieder schließen, ohne etwas zu nehmen.", "Die Zutat, die 'morgen' gekocht werden sollte, ist jetzt abgelaufen.", "Ihn um Mitternacht nur zum Reinschauen öffnen.", "Dieselben Reste zweimal reinstellen und beide Male vergessen.", "Die 'gesunden' Lebensmittel, gekauft und nie angerührt.", "Die Takeout-Boxen, die sich ein eigenes Fach verdient haben.", "Sein Museum halbleerer Saucen.", "Das 'werf ich nicht weg, brauch ich vielleicht' Ding, das jetzt schimmelt.", "Dein emotionaler Support-Türgriff in stressigen Momenten zu sein.", "Die Hälfte des Inhalts steckt gerade in einer Identitätskrise."],
        fr: ["Depuis combien de semaines ce légume est là-dedans.", "Ouvrir la porte et la refermer sans rien prendre.", "L'ingrédient que tu devais cuisiner 'demain' a expiré.", "L'ouvrir à minuit juste pour regarder.", "Mettre les mêmes restes deux fois et les oublier les deux fois.", "Les courses 'saines' achetées et jamais touchées.", "Les boîtes à emporter qui ont mérité leur propre étagère.", "Son musée de sauces à moitié utilisées.", "Le truc 'je le jette pas, ça pourrait servir' qui moisit maintenant.", "Être ta poignée de porte de soutien émotionnel dans le stress.", "La moitié de son contenu traverse actuellement une crise identitaire."],
        hu: ["Hány hete van ott az a zöldség.", "Kinyitni az ajtót és becsukni anélkül, hogy bármit is kivennél.", "A hozzávaló, amit 'holnap' akartál megfőzni, most lejárt.", "Éjfélkor kinyitni, csak hogy belenézz.", "Ugyanazt a maradékot kétszer betenni, és mindkétszer elfelejteni.", "Az 'egészséges' bevásárlás, amit megvettél és sosem nyúltál hozzá.", "Az elviteles dobozok, amik kiérdemelték a saját polcukat.", "A félig elhasznált szószok múzeuma.", "A 'nem dobom ki, hátha kell' dolog, ami most penészedik.", "Az érzelmi támasz ajtókilincsed lenni stresszes pillanatokban.", "A tartalom fele jelenleg identitásválságban van."]
      }
    },
    {
      question: {
            en: "If your work inbox could talk, what would it confess first?",
            tr: "Eğer iş e-postan konuşabilse, ilk ne itiraf ederdi?",
            de: "Wenn dein Arbeitspostfach sprechen könnte, was würde es zuerst gestehen?",
            fr: "Si ta boîte mail professionnelle pouvait parler, qu'avouerait-elle en premier ?",
            hu: "Ha a munkahelyi postaládád tudna beszélni, mit vallana be először?"
      },
      answers: {
            en: ["That CC'd thread nobody ever actually read.", "The task that started with 'first thing tomorrow' and never happened.", "The one sentence rewritten three times before sending.", "The Friday 5pm 'urgent' email that never actually was.", "The real number behind your 4,312 unread emails.", "The email that started with 'quick note' and ran five paragraphs.", "The reply-all you sent and instantly regretted.", "The confession sitting in drafts, never sent.", "The 'just so you know' email that was really an accusation.", "The one important email that landed in spam."],
            tr: ["CC'lenip hiç okunmayan o zinciri.", "'Yarın ilk iş' diye başlayıp asla yapılmayan görevi.", "Gönderilmeden önce üç kere yeniden yazılan tek cümleyi.", "Cuma 17:00'de gelen 'acil' mailin gerçekte hiç acil olmadığını.", "Okunmamış 4.312 e-postanın gerçek sayısını.", "'Kısaca' diye başlayıp beş paragraf süren o maili.", "Reply-all'a basıp sonra pişman olduğun anı.", "Taslaklar klasöründeki, hiç gönderilmeyen o itirafı.", "'Bilgin olsun' diye atılan ama aslında suçlama olan maili.", "Spam'e düşen ama aslında önemli olan o tek maili."],
            de: ["Diesen CC-Thread, den nie jemand wirklich gelesen hat.", "Die Aufgabe, die mit 'morgen als Erstes' begann und nie passierte.", "Den einen Satz, dreimal umgeschrieben vor dem Senden.", "Die 'dringende' Freitag-17-Uhr-Mail, die nie wirklich dringend war.", "Die echte Zahl hinter deinen 4.312 ungelesenen Mails.", "Die Mail, die mit 'kurze Notiz' begann und fünf Absätze wurde.", "Das Allen-antworten, das du sofort bereut hast.", "Das Geständnis in den Entwürfen, nie gesendet.", "Die 'nur damit du's weißt'-Mail, die eigentlich ein Vorwurf war.", "Die eine wichtige Mail, die im Spam landete."],
            fr: ["Ce fil en CC que personne n'a jamais vraiment lu.", "La tâche qui devait commencer 'demain en premier' et n'a jamais eu lieu.", "La phrase réécrite trois fois avant d'être envoyée.", "Le mail 'urgent' du vendredi 17h qui ne l'était jamais vraiment.", "Le vrai nombre derrière tes 4 312 mails non lus.", "Le mail qui a commencé par 'petite note' et a duré cinq paragraphes.", "Le répondre-à-tous envoyé et regretté aussitôt.", "La confession qui dort dans les brouillons, jamais envoyée.", "Le mail 'juste pour info' qui était en fait une accusation.", "Le seul mail important tombé dans les spams."],
            hu: ["Azt a CC-s láncot, amit sosem olvasott el senki igazán.", "A feladatot, ami 'holnap elsőként' kezdődött volna, de sosem történt meg.", "Az egy mondatot, amit háromszor átírtál küldés előtt.", "A pénteki 17 órás 'sürgős' mailt, ami sosem volt igazán az.", "A 4312 olvasatlan email valódi számát.", "A mailt, ami 'gyors megjegyzés'-sel kezdődött, és öt bekezdés lett belőle.", "A mindenkinek-válaszolást, amit rögtön megbántál.", "A piszkozatok között alvó vallomást, amit sosem küldtél el.", "A 'csak hogy tudd' mailt, ami valójában vádaskodás volt.", "Az egyetlen fontos mailt, ami a spamben landolt."]
      }
    },
    {
      question: {
            en: "If your friend group chat could talk, what would it say first?",
            tr: "Arkadaş grup sohbetin konuşabilse, ilk ne söylerdi?",
            de: "Wenn dein Freunde-Gruppenchat sprechen könnte, was würde er zuerst sagen?",
            fr: "Si ton groupe de discussion entre amis pouvait parler, que dirait-il en premier ?",
            hu: "Ha a baráti csoportos chated tudna beszélni, mit mondana először?"
      },
      answers: {
            en: ["Who always leaves you on 'seen' and never replies.", "How the birthday plan is still stuck at 'let's pick a date.'", "That the same meme got shared for the third time.", "That one person's last message was six months ago.", "That 'let's hang out this week' is basically a myth at this point.", "Who never once listens to the voice message.", "How many times the group name has been changed.", "That an argument was never resolved, just forgotten.", "Who replies with an emoji instead of actual words, every time.", "What 'muted but I love you guys' actually means."],
            tr: ["Kimin hep 'okundu' yapıp cevap vermediğini.", "Doğum günü planının hâlâ 'bir tarih bulalım' aşamasında olduğunu.", "Aynı meme'in üçüncü kez paylaşıldığını.", "Bir kişinin son mesajının altı ay önce olduğunu.", "'Bu hafta buluşalım' cümlesinin resmi bir efsane olduğunu.", "Kimin sesli mesajı hiç dinlemediğini.", "Grup adının kaç kere değiştirildiğini.", "Bir tartışmanın hâlâ çözülmediğini, sadece unutulduğunu.", "En çok kimin emoji ile cevap verip yazı yazmadığını.", "'Sessize aldım ama seviyorum sizi' cümlesinin gerçek anlamını."],
            de: ["Wer dich immer auf 'gelesen' stehen lässt und nie antwortet.", "Dass der Geburtstagsplan immer noch bei 'lasst uns ein Datum finden' steckt.", "Dass dasselbe Meme zum dritten Mal geteilt wurde.", "Dass die letzte Nachricht von jemandem sechs Monate her ist.", "Dass 'diese Woche treffen wir uns' mittlerweile ein Mythos ist.", "Wer die Sprachnachricht nie anhört.", "Wie oft der Gruppenname schon geändert wurde.", "Dass ein Streit nie gelöst, nur vergessen wurde.", "Wer immer nur mit Emoji statt echten Worten antwortet.", "Was 'stummgeschaltet, aber ich liebe euch' wirklich bedeutet."],
            fr: ["Qui te laisse toujours en 'vu' sans jamais répondre.", "Que le plan d'anniversaire est encore bloqué à 'trouvons une date'.", "Que le même mème a été partagé pour la troisième fois.", "Que le dernier message de quelqu'un date d'il y a six mois.", "Que 'on se voit cette semaine' est devenu un mythe.", "Qui n'écoute jamais le message vocal.", "Combien de fois le nom du groupe a changé.", "Qu'une dispute n'a jamais été résolue, juste oubliée.", "Qui répond toujours avec un emoji au lieu de vrais mots.", "Ce que 'en sourdine mais je vous aime' veut vraiment dire."],
            hu: ["Ki hagy mindig 'olvasva' állapotban, válasz nélkül.", "Hogy a szülinapi terv még mindig a 'válasszunk egy dátumot' fázisban van.", "Hogy ugyanaz a mém harmadszor lett megosztva.", "Hogy valakinek az utolsó üzenete fél éve volt.", "Hogy a 'találkozzunk ezen a héten' már-már legendává vált.", "Ki nem hallgatja meg soha a hangüzenetet.", "Hányszor változott már a csoport neve.", "Hogy egy vita sosem oldódott meg, csak feledésbe merült.", "Ki válaszol mindig emojival szöveg helyett.", "Mit jelent valójában a 'lenémítva, de szeretlek titeket'."]
      }
    },
    {
      question: {
            en: "If your gym membership card could talk, what would it complain about first?",
            tr: "Spor salonu kartın konuşabilse, ilk ne şikayet ederdi?",
            de: "Wenn deine Fitnessstudio-Karte sprechen könnte, worüber würde sie sich zuerst beschweren?",
            fr: "Si ta carte de salle de sport pouvait parler, de quoi se plaindrait-elle en premier ?",
            hu: "Ha az edzőtermi kártyád tudna beszélni, miről panaszkodna először?"
      },
      answers: {
            en: ["Its three famous weeks of fame in January.", "Being carried around and never actually used.", "How many times 'I'll go tomorrow' was said and broken.", "The showers being its only real workout.", "More time spent in front of the mirror than on the treadmill.", "'This month I'm really starting' becoming a monthly tradition.", "The parking lot getting more use than the gym itself.", "The annual contract being a promise nobody kept.", "The towel that never once got wet.", "The weight going up, just not the one on the scale."],
            tr: ["Ocak ayındaki o üç haftalık şöhretini.", "Cebinde taşınmaktan başka bir işe yaramadığını.", "Kaç kere 'yarın giderim' denip gidilmediğini.", "Duş almak için gidilen tek ziyaretleri.", "Aynanın önünde geçirilen sürenin, koşu bandından uzun olduğunu.", "'Bu ay gerçekten başlıyorum' cümlesinin artık bir gelenek olduğunu.", "Otoparkın spor salonundan daha çok kullanıldığını.", "Yıllık taahhüdün, asla tutulmayan bir sözden ibaret olduğunu.", "Havlunun hiç ıslanmadığını.", "Kilonun değil, sadece suçluluk duygusunun arttığını."],
            de: ["Ihre drei berühmten Wochen Ruhm im Januar.", "Nur herumgetragen und nie benutzt zu werden.", "Wie oft 'ich geh morgen' gesagt und gebrochen wurde.", "Dass die Dusche ihr einziges echtes Workout ist.", "Mehr Zeit vorm Spiegel als auf dem Laufband.", "Dass 'diesen Monat fang ich wirklich an' zur Monatstradition wurde.", "Dass der Parkplatz mehr genutzt wird als das Studio selbst.", "Dass der Jahresvertrag ein nie gehaltenes Versprechen ist.", "Das Handtuch, das nie nass wurde.", "Dass das Gewicht steigt, nur nicht das auf der Waage."],
            fr: ["Ses trois fameuses semaines de gloire en janvier.", "Être trimballée partout sans jamais servir.", "Combien de fois 'j'y vais demain' a été dit et jamais tenu.", "Que les douches sont son seul vrai entraînement.", "Plus de temps devant le miroir que sur le tapis de course.", "Que 'ce mois-ci je m'y mets vraiment' est devenu une tradition mensuelle.", "Que le parking sert plus que la salle elle-même.", "Que l'engagement annuel est une promesse jamais tenue.", "La serviette jamais mouillée.", "Que le poids augmente, juste pas celui de la balance."],
            hu: ["A januári háromhetes híres pillanatait.", "Hogy csak cipelik, de sosem használják.", "Hányszor mondták, hogy 'holnap megyek', és sosem tartották be.", "Hogy a zuhanyzás az egyetlen valódi edzés vele.", "Hogy több idő telik a tükör előtt, mint a futópadon.", "Hogy az 'ebben a hónapban tényleg elkezdem' havi hagyománnyá vált.", "Hogy a parkoló többet van használva, mint maga a terem.", "Hogy az éves szerződés egy sosem betartott ígéret.", "A törölközőt, ami sosem lett vizes.", "Hogy a súly nő, csak nem az, ami a mérlegen van."]
      }
    },
    {
      question: {
            en: "If your car's dashboard could talk, what would it say first?",
            tr: "Arabanın gösterge paneli konuşabilse, ilk ne derdi?",
            de: "Wenn das Armaturenbrett deines Autos sprechen könnte, was würde es zuerst sagen?",
            fr: "Si le tableau de bord de ta voiture pouvait parler, que dirait-il en premier ?",
            hu: "Ha az autód műszerfala tudna beszélni, mit mondana először?"
      },
      answers: {
            en: ["That the oil change warning has been ignored for three months.", "That the GPS gets muted so you can take your own 'better' route.", "The trust game played with the fuel light.", "That the back seat became a storage unit.", "The same song played for the hundredth time.", "That the handbrake is basically decorative.", "The parking sensor's panic moments.", "The habit of checking the phone at red lights.", "'Is this sound normal' being asked but never actually checked.", "The coins under the seat being a real hidden treasure."],
            tr: ["'Yağ değiştirme zamanı' uyarısının üç aydır görmezden gelindiğini.", "Navigasyonun sesini kısıp kendi bildiğin yoldan gittiğini.", "Benzin ikaz ışığıyla oynanan güven oyununu.", "Arka koltuğun bir depoya dönüştüğünü.", "Aynı şarkının yüzüncü kez çalındığını.", "El freninin süs olduğunu.", "Park sensörünün paniklediği anları.", "Trafik ışığında telefona bakma alışkanlığını.", "'Bu ses normal mi' diye sorup asla kontrol ettirmediğini.", "Koltuk altındaki kaybolan bozuk paraların gerçek bir hazine olduğunu."],
            de: ["Dass die Ölwechsel-Warnung seit drei Monaten ignoriert wird.", "Dass das Navi stummgeschaltet wird, um deine eigene 'bessere' Route zu fahren.", "Das Vertrauensspiel mit der Tankleuchte.", "Dass der Rücksitz zum Stauraum wurde.", "Denselben Song zum hundertsten Mal.", "Dass die Handbremse rein dekorativ ist.", "Die Panikmomente des Parksensors.", "Die Angewohnheit, an roten Ampeln aufs Handy zu schauen.", "'Ist das Geräusch normal' gefragt, aber nie geprüft.", "Dass die Münzen unter dem Sitz ein echter Schatz sind."],
            fr: ["Que l'alerte vidange est ignorée depuis trois mois.", "Que le GPS est coupé pour prendre ton propre chemin 'meilleur'.", "Le jeu de confiance joué avec le voyant essence.", "Que la banquette arrière est devenue un espace de rangement.", "La même chanson jouée pour la centième fois.", "Que le frein à main est purement décoratif.", "Les moments de panique du capteur de stationnement.", "L'habitude de regarder le téléphone aux feux rouges.", "'Ce bruit est normal ?' demandé mais jamais vérifié.", "Que les pièces sous le siège sont un vrai trésor caché."],
            hu: ["Hogy az olajcsere-figyelmeztetést három hónapja ignorálod.", "Hogy a navigációt lenémítod, hogy a saját 'jobb' utadon menj.", "A bizalmi játékot, amit az üzemanyag-jelzővel játszol.", "Hogy a hátsó ülés tárolóhellyé vált.", "Ugyanazt a dalt századszorra lejátszva.", "Hogy a kéziféket csak dísznek használod.", "A parkolóradar pánikpillanatait.", "A szokást, hogy piros lámpánál a telefont nézed.", "Az 'ez a hang normális?' kérdést, amit sosem néztél utána.", "Hogy az ülés alatti aprópénz egy valódi kincs."]
      }
    },
    {
      question: {
            en: "If your laundry hamper could talk, what would it confess first?",
            tr: "Kirli çamaşır sepetin konuşabilse, ilk ne itiraf ederdi?",
            de: "Wenn dein Wäschekorb sprechen könnte, was würde er zuerst gestehen?",
            fr: "Si ton panier à linge pouvait parler, qu'avouerait-il en premier ?",
            hu: "Ha a szennyeskosarad tudna beszélni, mit vallana be először?"
      },
      answers: {
            en: ["That even when full, one more item always gets thrown in.", "The real meaning of 'this can be worn one more time.'", "That the lid has never once closed properly.", "That half its contents are actually clean.", "Being the final destination for every piece of clothing.", "The smell test being an officially recognized method.", "Some clothes going in and never coming back out.", "'I'll wash it this weekend' being said for weeks straight.", "That its capacity is philosophical, not physical.", "That the missing single socks are hiding somewhere in there."],
            tr: ["Dolu olduğunda bile üstüne bir şey daha atıldığını.", "'Bir kere daha giyilir' cümlesinin gerçek anlamını.", "Kapağın hiç kapanmadığını.", "İçindekilerin yarısının aslında temiz olduğunu.", "Sepetin, kıyafetlerin gittiği son durak olduğunu.", "Koku testi yapmanın resmi bir yöntem olduğunu.", "Bazı kıyafetlerin oraya girip bir daha çıkmadığını.", "'Bu hafta sonu yıkarım' cümlesinin haftalardır tekrarlandığını.", "Sepetin kapasitesinin fiziksel değil, felsefi olduğunu.", "Tek çorapların, o sepette bir yerlerde saklandığını."],
            de: ["Dass selbst wenn er voll ist, immer noch was reingeworfen wird.", "Die wahre Bedeutung von 'das kann ich noch einmal anziehen'.", "Dass der Deckel noch nie richtig geschlossen hat.", "Dass die Hälfte des Inhalts eigentlich sauber ist.", "Die letzte Station für jedes Kleidungsstück zu sein.", "Dass der Geruchstest eine offiziell anerkannte Methode ist.", "Dass manche Kleidungsstücke reingehen und nie wieder rauskommen.", "Dass 'ich wasch's am Wochenende' seit Wochen gesagt wird.", "Dass seine Kapazität philosophisch ist, nicht physisch.", "Dass die verlorenen Einzelsocken irgendwo dort drin versteckt sind."],
            fr: ["Que même plein, on y jette toujours un truc de plus.", "Le vrai sens de 'ça peut encore se porter une fois'.", "Que le couvercle n'a jamais vraiment fermé.", "Que la moitié de son contenu est en fait propre.", "Être la destination finale de chaque vêtement.", "Que le test de l'odeur est une méthode officiellement reconnue.", "Que certains vêtements y entrent et n'en ressortent jamais.", "Que 'je lave ce week-end' est répété depuis des semaines.", "Que sa capacité est philosophique, pas physique.", "Que les chaussettes seules se cachent quelque part là-dedans."],
            hu: ["Hogy még tele is mindig belekerül még valami.", "Az 'ezt még egyszer fel lehet venni' valódi jelentését.", "Hogy a fedele sosem záródott rendesen.", "Hogy a tartalom fele valójában tiszta.", "Hogy minden ruhadarab végállomása.", "Hogy a szagteszt egy hivatalosan elismert módszer.", "Hogy némely ruha bekerül, és sosem jön ki onnan.", "Hogy a 'hétvégén kimosom' hetek óta ismétlődik.", "Hogy a kapacitása filozófiai, nem fizikai.", "Hogy az elveszett fél zoknik valahol ott rejtőznek."]
      }
    },
    {
      question: {
            en: "If your houseplant could talk, what would it complain about first?",
            tr: "Ev bitkin konuşabilse, ilk ne şikayet ederdi?",
            de: "Wenn deine Zimmerpflanze sprechen könnte, worüber würde sie sich zuerst beschweren?",
            fr: "Si ta plante d'intérieur pouvait parler, de quoi se plaindrait-elle en premier ?",
            hu: "Ha a szobanövényed tudna beszélni, miről panaszkodna először?"
      },
      answers: {
            en: ["Still not knowing if it'll die from thirst or overwatering.", "'I forgot' becoming a weekly routine.", "The promise to move it closer to sunlight, never kept.", "Its leaves yellowing from neglect, not dust.", "Not even being sure it has a name.", "The pot still wearing its original plastic sleeve.", "'This plant is low maintenance' being the biggest lie ever told.", "The neighboring plant getting more attention.", "The fertilizer bottle never once being opened.", "Surviving out of pure stubbornness, not your care."],
            tr: ["Susuzluktan mı, aşırı sulamadan mı öleceğine hâlâ karar verilemediğini.", "'Unuttum' cümlesinin haftalık bir rutin olduğunu.", "Güneşe daha yakın taşınma sözünün tutulmadığını.", "Yapraklarının tozdan değil, ihmalden sarardığını.", "Adının olup olmadığının bile net olmadığını.", "Saksının hâlâ o ilk günkü kılıfla durduğunu.", "'Bu bitki bakımı kolaymış' cümlesinin en büyük yalan olduğunu.", "Komşu bitkinin daha çok ilgi gördüğünü.", "Gübre şişesinin hiç açılmadığını.", "Hayatta kalmasının, senin sayende değil, kendi inadı sayesinde olduğunu."],
            de: ["Immer noch nicht zu wissen, ob sie an Durst oder Übergießen stirbt.", "Dass 'ich hab's vergessen' zur Wochenroutine wurde.", "Das nie gehaltene Versprechen, sie näher ans Licht zu stellen.", "Dass ihre Blätter vor Vernachlässigung gelb werden, nicht vor Staub.", "Nicht mal sicher zu sein, ob sie einen Namen hat.", "Dass der Topf noch die Original-Plastikhülle trägt.", "Dass 'diese Pflanze ist pflegeleicht' die größte Lüge aller Zeiten ist.", "Dass die Nachbarpflanze mehr Aufmerksamkeit bekommt.", "Dass die Düngerflasche nie geöffnet wurde.", "Dass sie aus purer Sturheit überlebt, nicht wegen deiner Pflege."],
            fr: ["Ne toujours pas savoir si elle va mourir de soif ou d'excès d'eau.", "Que 'j'ai oublié' est devenu une routine hebdomadaire.", "La promesse jamais tenue de la rapprocher de la lumière.", "Que ses feuilles jaunissent par négligence, pas par poussière.", "Ne même pas être sûre d'avoir un nom.", "Que le pot porte encore son emballage plastique d'origine.", "Que 'cette plante est facile d'entretien' est le plus gros mensonge jamais dit.", "Que la plante voisine reçoit plus d'attention.", "Que la bouteille d'engrais n'a jamais été ouverte.", "Survivre par pure obstination, pas grâce à tes soins."],
            hu: ["Hogy még mindig nem tudni, szomjan hal-e vagy a túlöntözéstől.", "Hogy az 'elfelejtettem' heti rutinná vált.", "A be nem tartott ígéretet, hogy közelebb kerül a fényhez.", "Hogy a levelei az elhanyagolástól sárgulnak, nem a portól.", "Hogy még abban sem biztos, van-e neve.", "Hogy a cserép még mindig az eredeti műanyag tokban van.", "Hogy 'ez a növény könnyen gondozható' minden idők legnagyobb hazugsága.", "Hogy a szomszéd növény több figyelmet kap.", "Hogy a műtrágyás üveget sosem nyitották ki.", "Hogy tisztán a saját makacsságából él túl, nem a gondoskodásodból."]
      }
    },
    {
      question: {
            en: "If your rented apartment could talk, what would it say first?",
            tr: "Kiraladığın ev konuşabilse, ilk ne söylerdi?",
            de: "Wenn deine gemietete Wohnung sprechen könnte, was würde sie zuerst sagen?",
            fr: "Si ton appartement loué pouvait parler, que dirait-il en premier ?",
            hu: "Ha a bérelt lakásod tudna beszélni, mit mondana először?"
      },
      answers: {
            en: ["That the mystery noise still has no explanation.", "'I'll mention it to the landlord' unsaid for a year now.", "That the stain on the wall has a story nobody's telling.", "The heater having exactly two modes: off and way too hot.", "The neighbor's noise becoming background music by now.", "Both of you knowing the deposit is never coming back.", "'I'm only here temporarily' being said for three years straight.", "One cabinet door that has never once closed properly.", "The wall art really just covering up holes.", "Rent going up while nothing else about the place ever changes."],
            tr: ["O tıkırtının hâlâ açıklanamadığını.", "'Ev sahibine söylerim' cümlesinin bir yıldır söylenmediğini.", "Duvardaki o lekenin bir hikayesi olduğunu.", "Isıtıcının iki modu olduğunu: kapalı ve çok sıcak.", "Komşu sesinin artık bir arka plan müziğine dönüştüğünü.", "Depozitonun asla geri gelmeyeceğini, ikinizin de bildiğini.", "'Geçici olarak buradayım' cümlesinin üç yıldır söylendiğini.", "Mutfak dolabının bir kapısının hiç düzgün kapanmadığını.", "Duvara asılan resimlerin, aslında delikleri gizlediğini.", "Kiranın artmasının, evin hiçbir şeyinin değişmemesiyle ters orantılı olduğunu."],
            de: ["Dass das mysteriöse Geräusch immer noch nicht erklärt ist.", "Dass 'ich sag's dem Vermieter' seit einem Jahr nicht gesagt wurde.", "Dass der Fleck an der Wand eine Geschichte hat, die keiner erzählt.", "Dass die Heizung genau zwei Modi hat: aus und viel zu heiß.", "Dass der Nachbarslärm mittlerweile Hintergrundmusik ist.", "Dass ihr beide wisst, die Kaution kommt nie zurück.", "Dass 'ich bin nur vorübergehend hier' seit drei Jahren gesagt wird.", "Eine Schranktür, die nie richtig geschlossen hat.", "Dass die Wandbilder eigentlich nur Löcher verdecken.", "Dass die Miete steigt, während sich sonst nichts an der Wohnung ändert."],
            fr: ["Que le bruit mystère n'a toujours pas d'explication.", "Que 'je le dirai au proprio' n'a pas été dit depuis un an.", "Que la tache sur le mur a une histoire que personne ne raconte.", "Que le chauffage n'a que deux modes : éteint et bien trop chaud.", "Que le bruit du voisin est devenu une musique de fond.", "Que vous savez tous les deux que le dépôt ne reviendra jamais.", "Que 'je suis là temporairement' est dit depuis trois ans.", "Une porte de placard qui n'a jamais bien fermé.", "Que les tableaux au mur cachent en fait des trous.", "Que le loyer augmente alors que rien d'autre ne change jamais."],
            hu: ["Hogy a rejtélyes zajra még mindig nincs magyarázat.", "Hogy a 'szólok a bérbeadónak' egy éve nem hangzott el.", "Hogy a foltnak a falon van egy története, amit senki sem mesél el.", "Hogy a fűtésnek pontosan két módja van: ki és túl meleg.", "Hogy a szomszéd zaja mára háttérzenévé vált.", "Hogy mindketten tudjátok, a kaució sosem jön vissza.", "Hogy az 'csak ideiglenesen vagyok itt' három éve hangzik el.", "Egy szekrényajtót, ami sosem záródott rendesen.", "Hogy a falra akasztott képek valójában lyukakat takarnak.", "Hogy a lakbér nő, miközben semmi más nem változik a lakásban."]
      }
    },
    {
      question: {
            en: "If your watch history could talk, what would it confess first?",
            tr: "İzleme geçmişin konuşabilse, ilk ne itiraf ederdi?",
            de: "Wenn deine Serien-Watchlist sprechen könnte, was würde sie zuerst gestehen?",
            fr: "Si ton historique de visionnage pouvait parler, qu'avouerait-il en premier ?",
            hu: "Ha a nézési előzményeid tudnának beszélni, mit vallanának be először?"
      },
      answers: {
            en: ["Starting the same show over for the third time.", "'Just one episode' turning into 2am.", "The lie always told when asked 'are you watching without me?'", "A movie abandoned halfway and never returned to.", "Falling asleep during documentaries becoming an official habit.", "'Let's watch this together' followed by watching it alone.", "The same trailer watched ten times, the movie never started.", "The algorithm knowing you better than you know yourself.", "'5 more minutes' turning into three more episodes.", "The watchlist being less a list, more a graveyard of intentions."],
            tr: ["Aynı diziyi üçüncü kez baştan izlemeye başladığını.", "'Sadece bir bölüm' cümlesinin gece yarısına kadar sürdüğünü.", "'İzleniyor mu' diye sorulunca hep yalan söylendiğini.", "Bir filmi yarıda bırakıp bir daha hiç dönülmediğini.", "Belgesel izlerken uyuyakalmanın resmi bir alışkanlık olduğunu.", "'Bunu birlikte izleyelim' denip yalnız izlendiğini.", "Aynı fragmanın on kere izlenip filme hiç başlanmadığını.", "Algoritmanın seni senden iyi tanıdığını.", "'5 dakika daha' cümlesinin üç bölüm sürdüğünü.", "İzlenecekler listesinin bir hayal, bir niyet mezarlığı olduğunu."],
            de: ["Dieselbe Serie zum dritten Mal von vorne anzufangen.", "Dass 'nur eine Folge' zu 2 Uhr nachts wird.", "Die Lüge, die immer erzählt wird bei 'schaust du ohne mich?'", "Ein Film, mittendrin abgebrochen und nie fortgesetzt.", "Dass Einschlafen bei Dokus zur offiziellen Gewohnheit wurde.", "'Das schauen wir zusammen', gefolgt von allein schauen.", "Denselben Trailer zehnmal geschaut, den Film nie begonnen.", "Dass der Algorithmus dich besser kennt als du dich selbst.", "Dass '5 Minuten mehr' zu drei weiteren Folgen wird.", "Dass die Watchlist weniger eine Liste als ein Friedhof der Vorsätze ist."],
            fr: ["Recommencer la même série pour la troisième fois.", "Que 'juste un épisode' se transforme en 2h du matin.", "Le mensonge toujours dit quand on demande 'tu regardes sans moi ?'", "Un film abandonné à mi-chemin, jamais repris.", "Que s'endormir devant les documentaires est devenu officiel.", "'On regarde ça ensemble' suivi d'un visionnage en solo.", "La même bande-annonce vue dix fois, le film jamais commencé.", "Que l'algorithme te connaît mieux que toi-même.", "Que '5 minutes de plus' devient trois épisodes de plus.", "Que la watchlist est moins une liste qu'un cimetière de bonnes intentions."],
            hu: ["Ugyanazt a sorozatot harmadszorra elölről kezdeni.", "Hogy a 'csak egy rész' hajnali 2-ig tartott.", "A hazugságot, amit mindig elmondasz, ha megkérdezik: 'nélkülem nézed?'", "Egy filmet, amit félbehagytál, és sosem folytattál.", "Hogy a dokumentumfilm alatti elalvás hivatalos szokássá vált.", "A 'ezt együtt nézzük meg' után egyedül nézést.", "Ugyanazt az előzetest tízszer megnézni, a filmet sosem elkezdeni.", "Hogy az algoritmus jobban ismer, mint te saját magad.", "Hogy az '5 perc még' három résszé vált.", "Hogy a nézőlista kevésbé lista, inkább a szándékok temetője."]
      }
    },
    {
      question: {
            en: "If your social media algorithm could talk, what would it say first?",
            tr: "Instagram algoritman konuşabilse, ilk ne derdi?",
            de: "Wenn dein Social-Media-Algorithmus sprechen könnte, was würde er zuerst sagen?",
            fr: "Si l'algorithme de tes réseaux sociaux pouvait parler, que dirait-il en premier ?",
            hu: "Ha a közösségimédia-algoritmusod tudna beszélni, mit mondana először?"
      },
      answers: {
            en: ["That it never forgets the one thing you looked at for two seconds.", "That it won't explain how it knew something you never searched.", "That the 'just for you' ad is shown to literally everyone.", "That it still remembers that weird 2am interest.", "That it knows you better than your closest friends.", "That your scroll speed is used to measure how interested you really are.", "That 'Explore' is really exploring you.", "That anything liked once is never, ever forgotten.", "That the ads know things you said out loud but never typed.", "That it was built to give you endless scrolling, not peace."],
            tr: ["İki saniye baktığın bir şeyi asla unutmadığını.", "Aramadığın bir şeyi nasıl bildiğini açıklamayacağını.", "'Sana özel' dediği reklamın herkese gösterildiğini.", "Bir gece 2'deki tuhaf ilgi alanını hâlâ hatırladığını.", "Seni tanımanın, en yakın arkadaşlarından daha iyi olduğunu.", "Kaydırma hızını, ilgi seviyeni ölçmek için kullandığını.", "'Keşfet'in aslında seni keşfettiğini.", "Bir kere beğenilen içeriğin bir daha asla unutulmadığını.", "Reklamların, söylediğin ama hiç yazmadığın şeyleri bildiğini.", "Sana huzur değil, sonsuz kaydırma sunmak için tasarlandığını."],
            de: ["Dass er nie vergisst, was du zwei Sekunden lang angeschaut hast.", "Dass er nicht erklärt, wie er etwas wusste, das du nie gesucht hast.", "Dass die 'nur für dich'-Werbung wortwörtlich jedem gezeigt wird.", "Dass er sich noch an dieses seltsame 2-Uhr-Interesse erinnert.", "Dass er dich besser kennt als deine engsten Freunde.", "Dass deine Scroll-Geschwindigkeit misst, wie interessiert du wirklich bist.", "Dass 'Entdecken' eigentlich dich entdeckt.", "Dass alles, was einmal geliked wurde, nie vergessen wird.", "Dass die Werbung Dinge kennt, die du laut gesagt, aber nie getippt hast.", "Dass er gebaut wurde, um dir endloses Scrollen zu geben, keinen Frieden."],
            fr: ["Qu'il n'oublie jamais ce que tu as regardé deux secondes.", "Qu'il ne t'expliquera pas comment il savait un truc jamais recherché.", "Que la pub 'juste pour toi' est montrée à absolument tout le monde.", "Qu'il se souvient encore de cet intérêt bizarre à 2h du matin.", "Qu'il te connaît mieux que tes amis les plus proches.", "Que ta vitesse de scroll sert à mesurer ton vrai intérêt.", "Que 'Explorer' t'explore en fait, toi.", "Que rien de liké une fois n'est jamais, jamais oublié.", "Que les pubs savent des trucs que t'as dits à voix haute, jamais tapés.", "Qu'il a été conçu pour te donner un scroll infini, pas la paix."],
            hu: ["Hogy sosem felejti el, amit két másodpercig néztél.", "Hogy nem árulja el, honnan tudott valamit, amit sosem kerestél.", "Hogy a 'neked szóló' hirdetést szó szerint mindenkinek megmutatják.", "Hogy még mindig emlékszik arra a fura hajnali 2-es érdeklődésre.", "Hogy jobban ismer, mint a legjobb barátaid.", "Hogy a görgetési sebességedet arra használja, hogy mérje az érdeklődésed.", "Hogy a 'Felfedezés' valójában téged fedez fel.", "Hogy amit egyszer lájkoltál, azt sosem felejti el.", "Hogy a hirdetések olyan dolgokat tudnak, amiket kimondtál, de sosem gépeltél be.", "Hogy azért épült, hogy végtelen görgetést adjon, nem békét."]
      }
    },
    {
      question: {
            en: "If your coffee machine could talk, what would it say first?",
            tr: "Kahve makinen konuşabilse, ilk ne söylerdi?",
            de: "Wenn deine Kaffeemaschine sprechen könnte, was würde sie zuerst sagen?",
            fr: "Si ta machine à café pouvait parler, que dirait-elle en premier ?",
            hu: "Ha a kávéfőződ tudna beszélni, mit mondana először?"
      },
      answers: {
            en: ["That it's actually your real manager.", "That your first sentence every morning is said to it, not to people.", "That the cleaning reminder light has been ignored for years.", "That 'just one cup' has never once been true.", "That suspicious fourth cup at 4pm.", "That nobody would wake up without its noise.", "Counting the days it got left on by mistake.", "Listening to more than most actual therapists do.", "Learning the water tank was empty right when it mattered most.", "That it earned retirement, but never gets replaced."],
            tr: ["Senin gerçek yöneticinin o olduğunu.", "Sabahki ilk cümlenin ona söylendiğini, insanlara değil.", "Temizlenmesi gerektiğini hatırlatan ışığın yıllardır görmezden gelindiğini.", "'Sadece bir fincan' cümlesinin asla tutulmadığını.", "Saat 16:00'daki o şüpheli dördüncü fincanı.", "Sesi olmasa kimsenin uyanamayacağını.", "Kapatılmayı unutulduğu günleri saydığını.", "Gerçek bir terapistten daha çok dinlediğini.", "Su deposunun boş olduğunu, tam ihtiyaç anında öğrendiğini.", "Emekliliği hak ettiğini ama asla değiştirilmediğini."],
            de: ["Dass sie eigentlich deine echte Chefin ist.", "Dass dein erster Satz jeden Morgen an sie geht, nicht an Menschen.", "Dass die Reinigungs-Erinnerung seit Jahren ignoriert wird.", "Dass 'nur eine Tasse' noch nie gestimmt hat.", "Diese verdächtige vierte Tasse um 16 Uhr.", "Dass ohne ihr Geräusch niemand aufwachen würde.", "Die Tage zu zählen, an denen sie versehentlich anblieb.", "Mehr zuzuhören als die meisten echten Therapeuten.", "Dass der Wassertank leer war, genau als es drauf ankam.", "Dass sie die Rente verdient hätte, aber nie ersetzt wird."],
            fr: ["Qu'elle est en fait ta vraie patronne.", "Que ta première phrase chaque matin lui est adressée, pas aux gens.", "Que le voyant nettoyage est ignoré depuis des années.", "Que 'juste une tasse' n'a jamais été vrai.", "Cette quatrième tasse suspecte à 16h.", "Que sans son bruit, personne ne se réveillerait.", "Compter les jours où elle est restée allumée par erreur.", "Écouter plus que la plupart des vrais thérapeutes.", "Que le réservoir d'eau était vide, pile au mauvais moment.", "Qu'elle a mérité la retraite, mais n'est jamais remplacée."],
            hu: ["Hogy valójában ő az igazi főnököd.", "Hogy minden reggel az első mondatod neki szól, nem embereknek.", "Hogy a tisztítási emlékeztető fényét évek óta ignorálod.", "Hogy a 'csak egy csésze' sosem volt igaz.", "Azt a gyanús negyedik csészét délután 4-kor.", "Hogy a zaja nélkül senki sem ébredne fel.", "Számolja azokat a napokat, amikor véletlenül bekapcsolva maradt.", "Hogy jobban hallgat, mint a legtöbb valódi terapeuta.", "Hogy a víztartály üres volt, pont a legfontosabb pillanatban.", "Hogy megérdemelte a nyugdíjat, de sosem cserélik le."]
      }
    },
    {
      question: {
            en: "If your doorbell camera could talk, what would it confess first?",
            tr: "Kapı zili kameran konuşabilse, ilk ne itiraf ederdi?",
            de: "Wenn deine Türklingelkamera sprechen könnte, was würde sie zuerst gestehen?",
            fr: "Si ta caméra de sonnette pouvait parler, qu'avouerait-elle en premier ?",
            hu: "Ha a kapucsengő-kamerád tudna beszélni, mit vallana be először?"
      },
      answers: {
            en: ["Recording you seeing the delivery guy and not answering.", "Not judging why you went outside at midnight, just watching.", "Seeing the neighbor's dog more often than the neighbor.", "Remembering every 'who is it' asked without ever checking.", "That most notifications are really just the wind.", "Recording the strange faces made while waiting at the door.", "That the mailman has a more organized life than you.", "Feeling relieved at 3am when it's nothing, just checking.", "The battery dying at exactly the wrong moment.", "Watching more out of curiosity than actual security."],
            tr: ["Kargocuyu görüp kapıyı açmamanı kaydettiğini.", "Gece yarısı neden dışarı çıktığını sorgulamadığını, sadece izlediğini.", "Komşunun köpeğini senden daha sık gördüğünü.", "'Kim o' diye sorup hiç bakmadığın anları hatırladığını.", "Bildirimlerin çoğunun sadece rüzgar olduğunu.", "Kapıda beklerken yaptığın tuhaf yüz ifadelerini kaydettiğini.", "Postacının senden daha düzenli bir hayatı olduğunu.", "Gece 3'te kapıya bakıp hiçbir şey olmadığını görünce rahatladığını.", "Şarjının bittiği tam da önemli anı kaçırdığını.", "Aslında güvenlik değil, meraktan izlediğini."],
            de: ["Aufzunehmen, wie du den Lieferanten siehst und nicht öffnest.", "Nicht zu urteilen, warum du um Mitternacht rausgegangen bist, nur zuzuschauen.", "Den Nachbarshund öfter zu sehen als den Nachbarn selbst.", "Sich an jedes 'wer ist da' zu erinnern, das nie überprüft wurde.", "Dass die meisten Benachrichtigungen einfach nur Wind sind.", "Die seltsamen Gesichter aufzunehmen, die du an der Tür machst.", "Dass der Postbote ein organisierteres Leben hat als du.", "Um 3 Uhr erleichtert zu sein, wenn's nur eine Kontrolle war.", "Dass der Akku genau im falschen Moment leer wird.", "Aus Neugier zu beobachten, nicht aus Sicherheitsgründen."],
            fr: ["Filmer que tu vois le livreur et n'ouvres pas.", "Ne pas juger pourquoi tu es sorti à minuit, juste regarder.", "Voir le chien du voisin plus souvent que le voisin lui-même.", "Se souvenir de chaque 'qui est-ce' jamais vérifié.", "Que la plupart des notifications, c'est juste le vent.", "Enregistrer les grimaces bizarres faites en attendant à la porte.", "Que le facteur a une vie plus organisée que la tienne.", "Être soulagée à 3h du matin quand ce n'est rien, juste une vérification.", "Que la batterie meurt pile au mauvais moment.", "Regarder plus par curiosité que pour la vraie sécurité."],
            hu: ["Rögzíti, hogy meglátod a futárt, és nem nyitsz ajtót.", "Nem ítélkezik azon, miért mentél ki éjfélkor, csak figyel.", "Gyakrabban látja a szomszéd kutyáját, mint a szomszédot.", "Emlékszik minden 'ki az' kérdésre, amit sosem néztél meg.", "Hogy a legtöbb értesítés csak a szél.", "Rögzíti a fura arckifejezéseket, amiket az ajtónál várva vágsz.", "Hogy a postásnak rendezettebb élete van, mint neked.", "Megkönnyebbül hajnali 3-kor, amikor kiderül, hogy semmi, csak ellenőrzés volt.", "Hogy az akku pont a legrosszabb pillanatban merül le.", "Inkább kíváncsiságból figyel, mint valódi biztonságból."]
      }
    },
    {
      question: {
            en: "If your credit card could talk, what would it say first?",
            tr: "Kredi kartın konuşabilse, ilk ne derdi?",
            de: "Wenn deine Kreditkarte sprechen könnte, was würde sie zuerst sagen?",
            fr: "Si ta carte de crédit pouvait parler, que dirait-elle en premier ?",
            hu: "Ha a hitelkártyád tudna beszélni, mit mondana először?"
      },
      answers: {
            en: ["That 'just this once' became a monthly ritual.", "That installments are just a scream sent into the future.", "That the minimum payment is a delay, not a solution.", "That nothing feels real until the statement arrives.", "That 'I'm collecting points' is really just an excuse.", "The deep breath taken before opening the app.", "That the limit is treated like a target, not a boundary.", "Late-night purchases turning into morning regret.", "That the 'emergency only' card is actually the most used one.", "That the loyalty program forgives a lot of disloyalty."],
            tr: ["'Sadece bu seferlik' cümlesinin aylık bir rutin olduğunu.", "Taksitlerin, geleceğe atılan bir çığlık olduğunu.", "Minimum ödemenin bir çözüm değil, erteleme olduğunu.", "Ekstre gelene kadar hiçbir şeyin gerçek olmadığını.", "'Puanları biriktiriyorum' cümlesinin bir bahane olduğunu.", "Uygulamayı açmadan önce derin nefes alındığını.", "Limitin, bir hedef değil bir engel olarak görüldüğünü.", "Gece yapılan alışverişlerin sabah pişmanlığa dönüştüğünü.", "'Acil durum kartı' olarak ayrılanın, en çok kullanılan kart olduğunu.", "Sadakat programının, sadakatsizliğe göz yumduğunu."],
            de: ["Dass 'nur dieses eine Mal' zum Monatsritual wurde.", "Dass Raten nur ein Schrei in die Zukunft sind.", "Dass die Mindestzahlung ein Aufschub ist, keine Lösung.", "Dass nichts real wirkt, bis die Abrechnung kommt.", "Dass 'ich sammle Punkte' eigentlich nur eine Ausrede ist.", "Der tiefe Atemzug vor dem Öffnen der App.", "Dass das Limit wie ein Ziel behandelt wird, nicht wie eine Grenze.", "Dass nächtliche Käufe zur morgendlichen Reue werden.", "Dass die 'nur für Notfälle'-Karte die meistgenutzte ist.", "Dass das Treueprogramm viel Untreue verzeiht."],
            fr: ["Que 'juste cette fois' est devenu un rituel mensuel.", "Que les mensualités sont juste un cri lancé vers le futur.", "Que le paiement minimum est un report, pas une solution.", "Que rien ne semble réel avant que le relevé arrive.", "Que 'je collectionne les points' n'est qu'une excuse.", "La grande inspiration avant d'ouvrir l'appli.", "Que la limite est traitée comme un objectif, pas une frontière.", "Que les achats nocturnes deviennent des regrets matinaux.", "Que la carte 'urgence seulement' est la plus utilisée.", "Que le programme de fidélité pardonne beaucoup d'infidélité."],
            hu: ["Hogy a 'csak ez az egyszer' havi rituálévá vált.", "Hogy a részletek csak egy kiáltás a jövő felé.", "Hogy a minimumfizetés halasztás, nem megoldás.", "Hogy semmi sem tűnik valóságosnak, amíg meg nem jön a számla.", "Hogy a 'pontokat gyűjtök' csak egy kifogás.", "A mély levegővételt app megnyitása előtt.", "Hogy a limitet célnak tekinted, nem korlátnak.", "Hogy az éjszakai vásárlások reggeli megbánássá válnak.", "Hogy a 'csak vészhelyzetre' kártya a leggyakrabban használt.", "Hogy a hűségprogram sok hűtlenséget megbocsát."]
      }
    },
    {
      question: {
            en: "If your umbrella could talk, what would it complain about first?",
            tr: "Şemsiyen konuşabilse, ilk ne şikayet ederdi?",
            de: "Wenn dein Regenschirm sprechen könnte, worüber würde er sich zuerst beschweren?",
            fr: "Si ton parapluie pouvait parler, de quoi se plaindrait-il en premier ?",
            hu: "Ha az esernyőd tudna beszélni, miről panaszkodna először?"
      },
      answers: {
            en: ["Only being remembered the moment it starts raining.", "Losing count of how many times it's been left somewhere.", "Being forgotten in the closet on sunny days.", "Fighting the wind with zero thanks in return.", "How many of its siblings are lost out there somewhere.", "'It won't rain today' being the biggest lie ever told.", "Being left at the bus stop being basically a tradition.", "Being folding-capable but never actually carried folded.", "Being the one item only remembered in an emergency.", "Buying a new one being easier than finding the old one."],
            tr: ["Sadece yağmur durunca hatırlandığını.", "Kaç kere bir yerde unutulduğunu, artık saymadığını.", "Güneşli günlerde dolapta unutulduğunu.", "Rüzgarla mücadele ederken kimsenin teşekkür etmediğini.", "Aslında kaç tane şemsiyenin bir yerlerde kaybolduğunu.", "'Bugün yağmur yağmaz' cümlesinin en büyük yalan olduğunu.", "Otobüs durağında unutulmanın bir gelenek olduğunu.", "Katlanabilir olanın, hiç katlı taşınmadığını.", "Sadece acil anlarda hatırlanan tek eşya olduğunu.", "Yeni bir tane almanın, eskisini bulmaktan daha kolay olduğunu."],
            de: ["Erst erinnert zu werden, sobald es zu regnen anfängt.", "Nicht mehr zu zählen, wie oft er irgendwo liegen blieb.", "An sonnigen Tagen im Schrank vergessen zu werden.", "Gegen den Wind zu kämpfen, ganz ohne Dank.", "Wie viele seiner Geschwister irgendwo verloren sind.", "Dass 'heute regnet es nicht' die größte Lüge aller Zeiten ist.", "Dass an der Bushaltestelle vergessen zu werden fast Tradition ist.", "Faltbar zu sein, aber nie gefaltet getragen zu werden.", "Das einzige, an das man sich nur im Notfall erinnert.", "Dass ein neuer zu kaufen leichter ist, als den alten zu finden."],
            fr: ["N'être remarqué qu'au moment où il commence à pleuvoir.", "Ne plus compter combien de fois il a été oublié quelque part.", "Être oublié dans le placard les jours de soleil.", "Se battre contre le vent sans jamais de remerciement.", "Combien de ses frères sont perdus quelque part dehors.", "Que 'il ne pleuvra pas aujourd'hui' est le plus gros mensonge jamais dit.", "Qu'être oublié à l'arrêt de bus est presque une tradition.", "Être pliable mais jamais transporté plié.", "Être le seul objet dont on se souvient qu'en urgence.", "Qu'acheter un neuf est plus facile que de retrouver l'ancien."],
            hu: ["Hogy csak akkor jut eszedbe, amikor elered az eső.", "Hogy már nem is számolja, hányszor hagyták valahol.", "Hogy napos napokon a szekrényben felejtik.", "Hogy a széllel harcol, köszönet nélkül.", "Hogy hány testvére veszett el valahol odakint.", "Hogy a 'ma nem fog esni' minden idők legnagyobb hazugsága.", "Hogy a buszmegállóban felejtés már-már hagyomány.", "Hogy összecsukható, de sosem összecsukva viszik.", "Hogy csak vészhelyzetben jut eszedbe.", "Hogy egy újat venni könnyebb, mint megtalálni a régit."]
      }
    },
    {
      question: {
            en: "If your bathroom scale could talk, what would it say first?",
            tr: "Banyo tartın konuşabilse, ilk ne derdi?",
            de: "Wenn deine Personenwaage sprechen könnte, was würde sie zuerst sagen?",
            fr: "Si ta balance de salle de bain pouvait parler, que dirait-elle en premier ?",
            hu: "Ha a fürdőszobai mérleged tudna beszélni, mit mondana először?"
      },
      answers: {
            en: ["That it tells a different truth depending on morning or evening.", "That 'I won't weigh myself today' has become a weekly strategy.", "That stepping on and off it is basically its own workout.", "That the reaction to the number is more interesting than the number itself.", "That some days it's ignored, other days it's obsessed over.", "The last number it showed before the battery died becoming legend.", "That holding your breath while stepping on never helped at all.", "That 'this weight is just water' has been repeated for weeks.", "Being tested on different floors, knowing full well the results differ.", "That it's really just a number, though it never feels that way."],
            tr: ["Sabah mı akşam mı tartıldığına göre farklı bir gerçeği söylediğini.", "'Bugün tartılmayayım' cümlesinin haftalık bir strateji olduğunu.", "Üstüne çıkılıp inilmesinin, tek başına bir egzersiz olduğunu.", "Sayının değil, ona verilen tepkinin daha ilginç olduğunu.", "Bazı günler görmezden gelindiğini, bazı günler saplantı haline geldiğini.", "Pil değişmeden önce gösterdiği son sayının efsaneye dönüştüğünü.", "Üstüne çıkarken nefesin tutulmasının bir işe yaramadığını.", "'Bu kilolar su' cümlesinin haftalarca tekrarlandığını.", "Farklı bir zeminde farklı sonuç verdiğini bile bile denendiğini.", "Aslında sadece bir sayı olduğunu, ama öyle hissettirilmediğini."],
            de: ["Dass sie je nach Morgen oder Abend eine andere Wahrheit erzählt.", "Dass 'ich wieg mich heute nicht' zur Wochenstrategie wurde.", "Dass Rauf- und Runtersteigen an sich schon ein Workout ist.", "Dass die Reaktion auf die Zahl interessanter ist als die Zahl selbst.", "Dass sie manche Tage ignoriert, andere Tage zur Obsession wird.", "Dass die letzte Zahl vor dem leeren Akku zur Legende wurde.", "Dass Luftanhalten beim Draufsteigen nie irgendwas gebracht hat.", "Dass 'das Gewicht ist nur Wasser' seit Wochen wiederholt wird.", "Auf verschiedenen Böden getestet zu werden, obwohl man die Unterschiede kennt.", "Dass sie eigentlich nur eine Zahl ist, sich aber nie so anfühlt."],
            fr: ["Qu'elle dit une vérité différente selon que c'est le matin ou le soir.", "Que 'je ne me pèse pas aujourd'hui' est devenu une stratégie hebdomadaire.", "Que monter et descendre est déjà un entraînement en soi.", "Que la réaction au chiffre est plus intéressante que le chiffre lui-même.", "Qu'elle est ignorée certains jours, obsession d'autres jours.", "Que le dernier chiffre avant que la pile meure est devenu légendaire.", "Que retenir sa respiration en montant n'a jamais aidé.", "Que 'ce poids c'est juste de l'eau' se répète depuis des semaines.", "Être testée sur différents sols, sachant très bien que ça change tout.", "Qu'elle n'est en fait qu'un chiffre, même si ça ne se sent jamais comme ça."],
            hu: ["Hogy más igazságot mond attól függően, reggel vagy este mérsz.", "Hogy a 'ma nem mérem meg magam' heti stratégiává vált.", "Hogy a rálépés és leszállás önmagában is egyfajta edzés.", "Hogy a számra adott reakció érdekesebb, mint maga a szám.", "Hogy egyes napokon ignorálják, más napokon megszállottság tárgya.", "Hogy az utolsó szám az akku lemerülése előtt legendává vált.", "Hogy a légzésvisszatartás rálépéskor sosem segített semmit.", "Hogy 'ez a súly csak víz' hetek óta ismétlődik.", "Hogy különböző padlókon tesztelik, pedig tudják, hogy más eredményt ad.", "Hogy valójában csak egy szám, mégsem úgy érződik."]
      }
    },
    {
      question: {
            en: "If your work calendar could talk, what would it confess first?",
            tr: "İş takvimin konuşabilse, ilk ne itiraf ederdi?",
            de: "Wenn dein Arbeitskalender sprechen könnte, was würde er zuerst gestehen?",
            fr: "Si ton agenda professionnel pouvait parler, qu'avouerait-il en premier ?",
            hu: "Ha a munkahelyi naptárad tudna beszélni, mit vallana be először?"
      },
      answers: {
            en: ["How many '15-minute quick meetings' actually ran an hour.", "That the 5 minutes between two meetings never help with anything.", "That any gap you think is 'yours' gets filled instantly.", "That lunch break turned into just another slot for meetings.", "That 'call if needed' really means 'please don't call.'", "Remembering every day two meetings collided at the same time.", "That Friday 4:30pm meetings are the ones nobody actually wants.", "That 'let's sync quickly' has never once been quick.", "Marking a day off and still checking email anyway.", "That a day that looks empty is really just not filled in yet."],
            tr: ["'15 dakikalık hızlı toplantı' diye başlayıp bir saat sürenleri saydığını.", "İki toplantı arasındaki 5 dakikanın hiçbir işe yetmediğini.", "'Bu boşluk bana ait' diye düşünülen zamanın hemen doldurulduğunu.", "Öğle arasının artık bir toplantı sığdırma alanına dönüştüğünü.", "'Gerekirse arayın' notunun aslında hiç aranmak istemediği anlamına geldiğini.", "Aynı saate iki toplantının çakıştığı günleri hatırladığını.", "Cuma 16:30'a konan toplantıların, kimsenin gerçekten istemediği toplantılar olduğunu.", "'Hızlıca senkron olalım' cümlesinin asla hızlı olmadığını.", "İzin günü işaretlenip yine de mail kontrol edildiğini.", "Boş görünen bir günün, aslında sadece henüz doldurulmamış olduğunu."],
            de: ["Wie viele '15-minütige Quick-Meetings' eine Stunde dauerten.", "Dass die 5 Minuten zwischen zwei Meetings für nichts reichen.", "Dass jede Lücke, die 'dir gehört', sofort gefüllt wird.", "Dass die Mittagspause nur ein weiterer Meeting-Slot wurde.", "Dass 'ruft bei Bedarf an' eigentlich heißt 'bitte nicht anrufen'.", "Sich an jeden Tag zu erinnern, an dem zwei Meetings kollidierten.", "Dass Freitag-16:30-Meetings die sind, die keiner wirklich will.", "Dass 'lass uns kurz syncen' noch nie kurz war.", "Einen freien Tag zu markieren und trotzdem Mails zu checken.", "Dass ein leer wirkender Tag einfach nur noch nicht gefüllt ist."],
            fr: ["Combien de 'réunions rapides de 15 minutes' ont duré une heure.", "Que les 5 minutes entre deux réunions ne servent jamais à rien.", "Que tout créneau que tu penses 't'appartenir' se remplit aussitôt.", "Que la pause déjeuner est devenue juste un créneau de réunion de plus.", "Que 'appelez si besoin' veut vraiment dire 'merci de ne pas appeler'.", "Se souvenir de chaque jour où deux réunions se sont chevauchées.", "Que les réunions du vendredi 16h30 sont celles que personne ne veut.", "Que 'on se synchronise vite fait' n'a jamais été rapide.", "Marquer un jour off et quand même vérifier ses mails.", "Qu'une journée qui semble vide n'est juste pas encore remplie."],
            hu: ["Hányszor tartott egy órán át a '15 perces gyors megbeszélés'.", "Hogy a két megbeszélés közötti 5 perc semmire sem elég.", "Hogy minden rés, amit 'a sajátodnak' hiszel, azonnal betelik.", "Hogy az ebédszünet csak egy újabb megbeszélési sáv lett.", "Hogy a 'hívj, ha kell' valójában azt jelenti: 'kérlek, ne hívj'.", "Emlékszik minden napra, amikor két megbeszélés összeütközött.", "Hogy a péntek 16:30-as megbeszélések azok, amiket senki sem akar igazán.", "Hogy a 'gyorsan szinkronizáljunk' sosem volt gyors.", "Szabadnapot jelölsz be, mégis nézed az emailt.", "Hogy egy üresnek tűnő nap valójában csak még nincs betöltve."]
      }
    },
    {
      question: {
            en: "If your dating app profile could talk, what would it say first?",
            tr: "Flört uygulaması profilin konuşabilse, ilk ne derdi?",
            de: "Wenn dein Dating-App-Profil sprechen könnte, was würde es zuerst sagen?",
            fr: "Si ton profil d'appli de rencontre pouvait parler, que dirait-il en premier ?",
            hu: "Ha a randiapp-profilod tudna beszélni, mit mondana először?"
      },
      answers: {
            en: ["That the main photo is three years old.", "That everyone who writes 'I love traveling' means the same two cities.", "That the bio's been deleted and rewritten three times.", "That swiping right takes far less thought than swiping left.", "That 'I'll text you soon' has gone unwritten for days.", "That matching is the easy part, the conversation is the real challenge.", "That the best photo on the profile is actually the oldest one.", "That 'looking for something serious' means something different to everyone.", "That some matches are only kept for the ego boost.", "That the app gets deleted and reopened again three days later."],
            tr: ["O fotoğrafın üç yıl önce çekildiğini.", "'Seyahat etmeyi seviyorum' yazan herkesin aynı iki şehri kastettiğini.", "Biyografinin, üç kere silinip yeniden yazıldığını.", "Sağa kaydırmanın, soldan çok daha az düşünülerek yapıldığını.", "'Az sonra yazarım' denip günlerce yazılmadığını.", "Eşleşmenin başlangıç, sohbetin asıl mücadele olduğunu.", "Profildeki en iyi fotoğrafın, aslında en eski fotoğraf olduğunu.", "'Ciddi bir ilişki arıyorum' yazısının herkes tarafından farklı yorumlandığını.", "Bazı eşleşmelerin sadece ego okşamak için tutulduğunu.", "Uygulamanın kapatılıp üç gün sonra tekrar açıldığını."],
            de: ["Dass das Hauptfoto drei Jahre alt ist.", "Dass jeder, der 'ich reise gerne' schreibt, dieselben zwei Städte meint.", "Dass die Bio dreimal gelöscht und neu geschrieben wurde.", "Dass Rechts-Wischen viel weniger Überlegung braucht als Links-Wischen.", "Dass 'schreib dir gleich' seit Tagen unerledigt ist.", "Dass Matchen der leichte Teil ist, das Gespräch die echte Herausforderung.", "Dass das beste Foto im Profil eigentlich das älteste ist.", "Dass 'suche was Ernstes' für jeden was anderes bedeutet.", "Dass manche Matches nur fürs Ego behalten werden.", "Dass die App gelöscht und drei Tage später wieder installiert wird."],
            fr: ["Que la photo principale a trois ans.", "Que tous ceux qui écrivent 'j'aime voyager' pensent aux deux mêmes villes.", "Que la bio a été supprimée et réécrite trois fois.", "Que swiper à droite demande bien moins de réflexion qu'à gauche.", "Que 'je t'écris bientôt' reste sans suite depuis des jours.", "Que matcher est la partie facile, la conversation le vrai défi.", "Que la meilleure photo du profil est en fait la plus ancienne.", "Que 'je cherche du sérieux' veut dire différentes choses pour chacun.", "Que certains matchs ne sont gardés que pour l'ego.", "Que l'appli est supprimée puis réinstallée trois jours plus tard."],
            hu: ["Hogy a főkép három éve készült.", "Hogy mindenki, aki azt írja: 'szeretek utazni', ugyanarra a két városra gondol.", "Hogy a bemutatkozást háromszor törölték és írták újra.", "Hogy a jobbra húzás sokkal kevesebb gondolkodást igényel, mint a balra.", "Hogy a 'mindjárt írok' napok óta megíratlan.", "Hogy a match a könnyű rész, a beszélgetés az igazi kihívás.", "Hogy a profil legjobb képe valójában a legrégebbi.", "Hogy a 'komoly kapcsolatot keresek' mindenkinek mást jelent.", "Hogy néhány matchet csak az egó simogatásáért tartanak meg.", "Hogy az appot törlik, majd három nap múlva újra telepítik."]
      }
    },
    {
      question: {
            en: "If your TV remote could talk, what would it complain about first?",
            tr: "Televizyon kumandan konuşabilse, ilk ne şikayet ederdi?",
            de: "Wenn deine Fernbedienung sprechen könnte, worüber würde sie sich zuerst beschweren?",
            fr: "Si ta télécommande pouvait parler, de quoi se plaindrait-elle en premier ?",
            hu: "Ha a tévé távirányítója tudna beszélni, miről panaszkodna először?"
      },
      answers: {
            en: ["Disappearing between couch cushions being a tradition.", "The battery dying right at the most exciting scene.", "'I'll turn it off in a second' being repeated for hours.", "That channel-surfing speed is a direct measure of indecision.", "The mute button being the most-used button during arguments.", "Volume going from a midnight whisper to a morning explosion.", "That half its buttons' functions are a complete mystery by now.", "Remembering every time it got thrown across the room in frustration.", "Being replaced by a phone app that never quite works right.", "That the real power in the house belongs to it, actually."],
            tr: ["Koltuk minderlerinin arasında kaybolmanın bir gelenek olduğunu.", "Pilinin bittiği tam da en heyecanlı sahnede fark edildiğini.", "'Az sonra kapatırım' cümlesinin saatlerce tekrarlandığını.", "Kanal değiştirme hızının, kararsızlığın doğrudan bir göstergesi olduğunu.", "Sessize alma tuşunun, tartışmalarda en çok kullanılan tuş olduğunu.", "Ses seviyesinin gece yarısı fısıltıya, sabah patlamaya döndüğünü.", "Düğmelerin yarısının artık ne işe yaradığının bilinmediğini.", "Uzaktan kumandanın uzağa fırlatıldığı anları hatırladığını.", "Telefon uygulamasıyla değiştirilmeye çalışılıp asla tam olmadığını.", "Gerçek gücün, aslında onda olduğunu."],
            de: ["Dass zwischen den Sofakissen zu verschwinden Tradition ist.", "Dass der Akku genau in der spannendsten Szene leer wird.", "Dass 'mach ich gleich aus' seit Stunden wiederholt wird.", "Dass die Zapp-Geschwindigkeit direkt die Unentschlossenheit misst.", "Dass die Stummtaste bei Streits am meisten benutzt wird.", "Dass die Lautstärke von Mitternachtsflüstern zu Morgenexplosion wechselt.", "Dass die Hälfte ihrer Tasten mittlerweile ein Rätsel ist.", "Sich an jedes Mal zu erinnern, wenn sie frustriert durchs Zimmer flog.", "Durch eine Handy-App ersetzt zu werden, die nie richtig funktioniert.", "Dass die eigentliche Macht im Haus tatsächlich bei ihr liegt."],
            fr: ["Que disparaître entre les coussins du canapé est une tradition.", "Que la pile meurt pile à la scène la plus excitante.", "Que 'j'éteins dans une seconde' se répète depuis des heures.", "Que la vitesse de zapping mesure directement l'indécision.", "Que le bouton muet est le plus utilisé pendant les disputes.", "Que le volume passe d'un murmure minuit à une explosion matinale.", "Que la moitié de ses boutons est désormais un mystère total.", "Se souvenir de chaque fois qu'elle a été jetée à travers la pièce.", "Être remplacée par une appli téléphone qui ne marche jamais bien.", "Que le vrai pouvoir dans la maison lui appartient en fait, à elle."],
            hu: ["Hogy a kanapépárnák közötti eltűnés hagyomány.", "Hogy az elem pont a legizgalmasabb jelenetnél merül le.", "Hogy a 'mindjárt kikapcsolom' órák óta ismétlődik.", "Hogy a csatornaváltás sebessége közvetlenül méri a döntésképtelenséget.", "Hogy a némító gomb a legtöbbet használt gomb veszekedések alatt.", "Hogy a hangerő éjféli suttogásból reggeli robbanássá válik.", "Hogy a gombjai felének funkciója mára rejtély.", "Emlékszik minden alkalomra, amikor frusztrációból átdobták a szobán.", "Hogy egy telefonos app váltja fel, ami sosem működik rendesen.", "Hogy a valódi hatalom a házban valójában nála van."]
      }
    },
    {
      question: {
            en: "If your bed could talk, what would it confess first?",
            tr: "Yatağın konuşabilse, ilk ne itiraf ederdi?",
            de: "Wenn dein Bett sprechen könnte, was würde es zuerst gestehen?",
            fr: "Si ton lit pouvait parler, qu'avouerait-il en premier ?",
            hu: "Ha az ágyad tudna beszélni, mit vallana be először?"
      },
      answers: {
            en: ["That '5 more minutes' is said to it, not to the clock.", "Being the official owner of every Sunday.", "Being the hardest place in the world to leave.", "That more time is spent scrolling on it than actually sleeping.", "That finding the right pillow spot is basically an art form.", "That 'I'll sleep early tonight' has run past midnight again.", "That the blanket isn't a boundary, it's a fortress.", "Being the first thing blamed the moment the alarm goes off.", "How different the relationship is on weekdays versus weekends.", "That honestly, nobody really ever wants to leave it."],
            tr: ["'5 dakika daha' cümlesinin ona söylendiğini, saate değil.", "Pazar günlerinin resmi sahibi olduğunu.", "Terk edilmenin en zor olduğu yer olduğunu.", "Üstünde geçirilen zamanın, uykudan çok telefon kaydırmakla geçtiğini.", "Yastığın doğru tarafının bulunmasının bir sanat olduğunu.", "'Bugün erken yatacağım' cümlesinin gece yarısını geçtiğini.", "Battaniyenin bir sınır değil, bir kale olduğunu.", "Alarm çalınca ilk suçlananın kendisi olduğunu.", "Hafta içi ve hafta sonu arasındaki ilişkinin çok farklı olduğunu.", "Aslında kimsenin ondan gerçekten ayrılmak istemediğini."],
            de: ["Dass '5 Minuten mehr' zu ihm gesagt wird, nicht zur Uhr.", "Der offizielle Besitzer jedes Sonntags zu sein.", "Der schwerste Ort der Welt zu sein, den man verlässt.", "Dass mehr Zeit mit Scrollen als mit echtem Schlafen verbracht wird.", "Dass die richtige Kissenposition zu finden fast eine Kunstform ist.", "Dass 'heute schlaf ich früh' wieder über Mitternacht ging.", "Dass die Decke keine Grenze ist, sondern eine Festung.", "Der Erste zu sein, dem die Schuld gegeben wird, wenn der Wecker klingelt.", "Wie unterschiedlich die Beziehung unter der Woche und am Wochenende ist.", "Dass ehrlich gesagt niemand es je wirklich verlassen will."],
            fr: ["Que '5 minutes de plus' lui est dit, pas à l'horloge.", "Être le propriétaire officiel de chaque dimanche.", "Être l'endroit le plus dur au monde à quitter.", "Que plus de temps y est passé à scroller qu'à vraiment dormir.", "Que trouver le bon coin d'oreiller est presque un art.", "Que 'je me couche tôt ce soir' a encore dépassé minuit.", "Que la couverture n'est pas une limite, c'est une forteresse.", "Être la première chose blâmée dès que l'alarme sonne.", "À quel point la relation diffère en semaine et le week-end.", "Qu'honnêtement, personne ne veut jamais vraiment le quitter."],
            hu: ["Hogy az 'öt perc még'-et neki mondod, nem az órának.", "Hogy minden vasárnap hivatalos tulajdonosa.", "Hogy a világ legnehezebb hely, ahonnan el kell menni.", "Hogy több idő telik rajta görgetéssel, mint tényleges alvással.", "Hogy a jó párnapozíció megtalálása szinte művészet.", "Hogy a 'ma korán lefekszem' megint túllépte az éjfélt.", "Hogy a takaró nem határ, hanem erőd.", "Hogy őt hibáztatják először, amint megszólal az ébresztő.", "Mennyire más a kapcsolat hétköznap és hétvégén.", "Hogy őszintén szólva senki sem akarja igazán elhagyni."]
      }
    },
    {
      question: {
            en: "If your shoe closet could talk, what would it say first?",
            tr: "Ayakkabı dolabın konuşabilse, ilk ne söylerdi?",
            de: "Wenn dein Schuhschrank sprechen könnte, was würde er zuerst sagen?",
            fr: "Si ton placard à chaussures pouvait parler, que dirait-il en premier ?",
            hu: "Ha a cipősszekrényed tudna beszélni, mit mondana először?"
      },
      answers: {
            en: ["That one pair was worn once and never again.", "That 'I bought these for sport' is a lie still on the label.", "That the most loved pair is actually the least worn.", "That the box is kept because 'it holds the value.'", "That single shoes are lost somewhere in there, always.", "That the comfortable ones sit in the corner, the good-looking ones up front.", "That 'I'll wear these today' gets reconsidered at the last second.", "That the price of one pair is still remembered, three years later.", "That the rain boots only work one day a year.", "That its capacity is smaller than your sense of guilt."],
            tr: ["Bir çiftin, bir kere giyilip bir daha çıkmadığını.", "'Bunu spor için aldım' yalanının hâlâ etikette durduğunu.", "En sevilen çiftin, en az giyilen çift olduğunu.", "Kutunun saklandığını, 'değeri düşer' diye.", "Tek ayakkabıların bir yerlerde kaybolduğunu, hep.", "Rahat olanların köşede, güzel olanların önde durduğunu.", "'Bugün bunu giyeceğim' denip son anda vazgeçildiğini.", "Bir çiftin fiyatının hâlâ hatırlandığını, üç yıl sonra bile.", "Yağmur botlarının yılda bir kere görev yaptığını.", "Dolabın kapasitesinin, vicdanın kapasitesinden daha az olduğunu."],
            de: ["Dass ein Paar einmal getragen und nie wieder angezogen wurde.", "Dass 'die hab ich für Sport gekauft' immer noch als Lüge am Etikett hängt.", "Dass das liebste Paar eigentlich das am wenigsten getragene ist.", "Dass die Box aufbewahrt wird, weil 'sie den Wert erhält'.", "Dass Einzelschuhe immer irgendwo darin verloren gehen.", "Dass die bequemen in der Ecke stehen, die schicken vorne.", "Dass 'die zieh ich heute an' in letzter Sekunde überdacht wird.", "Dass der Preis eines Paars noch nach drei Jahren erinnert wird.", "Dass die Regenstiefel nur einen Tag im Jahr im Einsatz sind.", "Dass seine Kapazität kleiner ist als dein Schuldgefühl."],
            fr: ["Qu'une paire n'a été portée qu'une fois, jamais reprise.", "Que 'je les ai achetées pour le sport' est un mensonge encore sur l'étiquette.", "Que la paire la plus aimée est en fait la moins portée.", "Que la boîte est gardée parce que 'ça garde la valeur'.", "Que des chaussures seules se perdent toujours quelque part là-dedans.", "Que les confortables sont dans le coin, les jolies devant.", "Que 'je mets ça aujourd'hui' se reconsidère à la dernière seconde.", "Que le prix d'une paire est encore mémorisé, trois ans après.", "Que les bottes de pluie ne servent qu'un jour par an.", "Que sa capacité est plus petite que ton sentiment de culpabilité."],
            hu: ["Hogy egy párat egyszer felvettek, és sosem többé.", "Hogy 'ezt sportra vettem' hazugsága még mindig ott van a címkén.", "Hogy a legkedveltebb pár valójában a legkevésbé hordott.", "Hogy a dobozt megtartják, mert 'megőrzi az értékét'.", "Hogy a magányos cipők mindig eltűnnek valahol odabent.", "Hogy a kényelmesek a sarokban, a szépek elöl állnak.", "Hogy 'ezt veszem fel ma' az utolsó pillanatban meggondolásra kerül.", "Hogy egy pár árát még három év múlva is fejből tudod.", "Hogy az esőcsizma évente csak egyszer dolgozik.", "Hogy a kapacitása kisebb, mint a lelkiismeret-furdalásod."]
      }
    },
    {
      question: {
            en: "If your phone charger cable could talk, what would it confess first?",
            tr: "Şarj kablon konuşabilse, ilk ne itiraf ederdi?",
            de: "Wenn dein Ladekabel sprechen könnte, was würde es zuerst gestehen?",
            fr: "Si ton câble de chargeur pouvait parler, qu'avouerait-il en premier ?",
            hu: "Ha a töltőkábeled tudna beszélni, mit vallana be először?"
      },
      answers: {
            en: ["That it was never actually lost, just hiding.", "That not being found in the exact moment of need feels like fate.", "That it won't explain why it always breaks at the same spot.", "'Borrowing' someone else's and never giving it back.", "Always being found tangled up in the bag.", "That the outlet at 1% battery is the most valuable thing in the world.", "That the original one became a legend nobody actually owns anymore.", "That the car charger is more reliable than the one at home.", "That the one wrapped in tape is somehow the most loyal.", "That it always disappears on the busiest possible day."],
            tr: ["Aslında hiç kaybolmadığını, sadece saklandığını.", "Tam ihtiyaç anında bulunamamanın bir kader olduğunu.", "Ucunun neden hep aynı yerden koptuğunu açıklamayacağını.", "Başkasının kablosunu 'ödünç alıp' hiç geri vermediğini.", "Çantada hep dolanmış halde bulunduğunu.", "%1'de bulunan prizin, en değerli eşya olduğunu.", "Orijinal olanın bir efsaneye dönüştüğünü, artık kimsede olmadığını.", "Araba şarj kablosunun, evdekinden daha güvenilir olduğunu.", "Bant ile sarılmış olanın, en sadık olanı olduğunu.", "Kayboluşunun, her zaman en yoğun günde gerçekleştiğini."],
            de: ["Dass es eigentlich nie verloren war, nur versteckt.", "Dass es sich wie Schicksal anfühlt, genau im Bedarfsmoment nicht gefunden zu werden.", "Dass es nicht erklärt, warum es immer an derselben Stelle bricht.", "Ein anderes 'auszuleihen' und nie zurückzugeben.", "Immer verheddert in der Tasche gefunden zu werden.", "Dass die Steckdose bei 1% Akku das Wertvollste der Welt ist.", "Dass das Original-Kabel zur Legende wurde, die keiner mehr besitzt.", "Dass das Autoladekabel zuverlässiger ist als das zu Hause.", "Dass das mit Klebeband umwickelte irgendwie das treueste ist.", "Dass es immer am arbeitsreichsten Tag verschwindet."],
            fr: ["Que jamais vraiment perdu, juste caché.", "Que ne pas être trouvé pile au moment du besoin ressemble au destin.", "Qu'il n'expliquera pas pourquoi il casse toujours au même endroit.", "'Emprunter' celui de quelqu'un d'autre et ne jamais le rendre.", "Être toujours retrouvé emmêlé dans le sac.", "Que la prise à 1% de batterie est la chose la plus précieuse au monde.", "Que le câble d'origine est devenu une légende que plus personne ne possède.", "Que le chargeur de voiture est plus fiable que celui de la maison.", "Que celui scotché est étrangement le plus loyal.", "Qu'il disparaît toujours le jour le plus chargé possible."],
            hu: ["Hogy valójában sosem veszett el, csak elbújt.", "Hogy pont a szükség pillanatában nem találod, mintha sors lenne.", "Hogy nem árulja el, miért mindig ugyanott törik el.", "Hogy 'kölcsönveszed' valaki másét, és sosem adod vissza.", "Hogy mindig összegabalyodva találod a táskában.", "Hogy az 1%-nál talált konnektor a világ legértékesebb dolga.", "Hogy az eredeti legendává vált, amit már senki sem birtokol.", "Hogy az autós töltő megbízhatóbb, mint az otthoni.", "Hogy a ragasztószalaggal átkötött valahogy a leghűségesebb.", "Hogy mindig a legforgalmasabb napon tűnik el."]
      }
    }
  ];

  var els = {};
  var lastPromptIdx = -1;
  var hasRun = false;

  function currentLang() {
    var l = document.documentElement.lang;
    return (l && UI[l]) ? l : 'en';
  }

  function pickPrompt() {
    var idx;
    do { idx = Math.floor(Math.random() * PROMPTS.length); } while (PROMPTS.length > 1 && idx === lastPromptIdx);
    lastPromptIdx = idx;
    return PROMPTS[idx];
  }

  function applyStaticText() {
    var l = currentLang();
    var t = UI[l];
    if (els.kicker) els.kicker.textContent = t.kicker;
    if (els.heading) els.heading.textContent = t.heading;
    if (els.intro) els.intro.textContent = t.intro;
    if (els.runBtn) els.runBtn.textContent = hasRun ? t.again : t.run;
    if (els.thinkingLabel) els.thinkingLabel.textContent = t.thinking;
    // keep the currently shown question in sync if the language changes mid-view
    if (els.question && els.question.dataset.promptIdx !== undefined) {
      var p = PROMPTS[+els.question.dataset.promptIdx];
      if (p) els.question.textContent = p.question[l] || p.question.en;
    }
  }

  function run() {
    var l = currentLang();
    els.runBtn.disabled = true;
    els.answerWrap.classList.remove('show');
    els.thinking.classList.add('show');

    setTimeout(function () {
      var prompt = pickPrompt();
      var pIdx = PROMPTS.indexOf(prompt);
      els.question.textContent = prompt.question[l] || prompt.question.en;
      els.question.dataset.promptIdx = pIdx;

      var pool = prompt.answers[l] || prompt.answers.en;
      var answer = pool[Math.floor(Math.random() * pool.length)];

      els.thinking.classList.remove('show');
      els.answerText.textContent = answer;
      els.answerWrap.classList.add('show');
      els.runBtn.disabled = false;
      hasRun = true;
      applyStaticText();
    }, 900 + Math.random() * 400);
  }

  function init() {
    els.kicker = document.getElementById('omKicker');
    els.heading = document.getElementById('omHeading');
    els.intro = document.getElementById('omIntro');
    els.question = document.getElementById('omQuestion');
    els.runBtn = document.getElementById('omRunBtn');
    els.thinking = document.getElementById('omThinking');
    els.thinkingLabel = document.getElementById('omThinkingLabel');
    els.answerWrap = document.getElementById('omAnswerWrap');
    els.answerText = document.getElementById('omAnswerText');
    if (!els.runBtn) return;

    // show a random starting question before the first press
    var initial = pickPrompt();
    var initIdx = PROMPTS.indexOf(initial);
    els.question.dataset.promptIdx = initIdx;

    els.runBtn.addEventListener('click', run);
    window.addEventListener('oddvi:lang', applyStaticText);

    applyStaticText();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
