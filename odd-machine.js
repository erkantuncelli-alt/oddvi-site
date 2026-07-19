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
