---
id: basic-snap-usage-pl
summary: W tym poradniku zostaną poruszone podstawowe informacje dotyczące korzystania z pakietów snap na Twojej dystrybucji oraz korzyści wynikające z używania ich.
categories: packaging
language: pl
status: published
tags: snap, usage, beginner, idf-2016, polish, hidden
difficulty: 1
translator: Marcin Mikołajczak
published: 2017-11-28
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Canonical Web Team <webteam@canonical.com>

---

# Podstawy korzystania ze snapów

## Wprowadzenie
Duration: 1:00

: Switch language: PL | [EN](tutorial/basic-snap-usage)

Witamy w świecie snapów! W tym poradniku zostaną opisane podstawy korzystania z pakietów [snap] i Twojej dystrybucji Linuxa oraz poznasz korzyści wynikające z ich działania.


![IMAGE](./snaps-hero.png)


### Czego się nauczysz?

  - Jak zainstalować usługę snapd na Twoim systemie.
  - Jak szukać oprogramowania.
  - Jak sprawdzić listę zainstalowanego oprogramowania.
  - Jak aktualizowane są snapy.
  - Czym są kanały snap i jak korzystać z nich.
  - Jak wrócić do poprzedniej wersji snapa.

Jeżeli wydaje Ci się to natłokiem informacji, przekonasz się, że jest inaczej. To wszystko jest bardzo proste dzięki prostocie interfejsu wiersza poleceń snapa.

### Czego potrzebujesz?

  - Dowolnej wspieranej dystrybucji systemu GNU/Linux (przeczytaj następny krok, aby poznać szczegóły).
  - Podstawowej wiedzy dotyczącej korzystania z wiersza poleceń.

Ten poradnik jest skupiony na poleceniu snap. Możesz po prostu skopiować i wkleić te polecenia.

Survey
: Jak wykorzystasz ten poradnik?
 - Tylko przeczytam go
 - Przeczytam i wykonam ćwiczenia
: Jakie jest Twoje obecne doświadczenie?
 - Nowicjusz
 - Średniozaawansowany
 - Doświadczony

## Konfiguracja
Duration: 2:00

### Instalacja snapd
`snapd` jest usługą, która działa na Twoim urządzeniu i monitoruje zainstalowane snapy, współdziała ze sklepem i dostarcza polecenie snap z którego będziesz korzystać. Instalacja na wymienionych poniżej dystrybucjach jest bezproblemowa.


![IMAGE](./hero-artwork.png)



### Różne dystrybucje:

**Arch**

```bash
$ sudo pacman -S snapd

# aktywuj usługę snapd:
sudo systemctl enable --now snapd.socket
```

**Debian (Stretch i Sid)**

```bash
$ sudo apt install snapd
```

**Fedora**

```bash
$ sudo dnf install snapd

**openSuSE**

```bash
$ sudo zypper addrepo http://download.opensuse.org/repositories/system:/snappy/openSUSE_Leap_42.2/ snappy
$ sudo zypper install snapd
```

**OpenWrt**

Aktywuj [snap-openwrt feed].

**Ubuntu**
W wersji 16.04 LTS desktop wszystko powinno być domyślnie aktywne. Na 14.04, wykonaj instalację poleceniem:

```bash
$ sudo apt install snapd
```

Po instalacji snapd, uruchom system ponownie.

Ponieważ wszystko jest gotowe, zainstalujmy pierwszego snapa!

## Instalacja i uruchamianie pierwszego snapa
Duration: 3:00

### Wyszukiwanie snapów

Usługa `snapd` jest uruchomiona, więc rozpocznijmy korzystanie z niej! W ten sposób odnajdziesz aplikacje typu „hello world” w sklepie:

```bash
$ snap find hello
hello-node-snap       1.0.2        bhdouglass      -  	A simple hello world command
hello-mdeslaur        2.10 	mdeslaur	-  	GNU Hello, the "hello world" snap
hello-snap    	0.01 	muhammad	-  	GNU hello-snap, the "Hello, Snap!" snap
hello         	2.10 	canonical       -  	GNU Hello, the "hello world" snap
hello-world   	6.3  	canonical       -  	The 'hello-world' of snaps
hello-sergiusens      1.0  	sergiusens      -  	hello world example
hello-gabriell	0.1  	gabriell	-  	Qt Hello World example
hello-bluet   	0.1  	bluet   	-  	Qt Hello World example
so-hello-world	0.2  	shadowen	-  	the old classic
hello-huge    	1.0  	noise   	-  	a really big snap
```

`snap find <wyszukiwana fraza>` przeszuka sklep i zwróci wyniki wraz z wersją pakietu, nazwami autorów i opisem.

### Instalacja i uruchomienie

Jak możesz zauważyć, wielu twórców udostępniło snapy typu „hello world”. Zainstalujmy jeden z nich.

```bash
$ sudo snap install hello

hello (stable) 2.10 from 'canonical' installed
```

positive
: Informacja: kiedy zainstalujesz pierwszego snapa, snapd pobierze bazowy pakiet uruchomieniowy `core` (który zawiera niewielką liczbę aplikacji o wadze do 90 megabajtów). W rezultacie, czas pobrania pierwszego snapa może być trochę dłuższy niż w przypadku kolejnych.


Aby uruchomić pakiet, wprowadź hello w wiersz poleceń (jest to polecenie dostarczone przez snap `hello`:

```bash
$ hello
Hello, world!
```

Oczywiście to tylko prosty przykład, który ma cechy wspólne dla wszystkich snapów. Aplikacja hello jest odizolowana i ma dostęp tylko do własnych danych.

### Sprawdź, które snapy są zainstalowane

Aby wyświetlić listę zainstalowanych snapów, wprowadź `snap list`, które poda również wersję programu, autora i dodatkowe informacje.


```bash
$ snap list
Name             	Version	Rev  Developer   Notes
hello            	2.10   	20   canonical   -
core      	16.04.1	423  canonical   -
```

Zauważ, że bazowy pakiet uruchomieniowy `core` również znajduje się na liście. Zawiera on również aktualna wersję snapd, dzięki czemu będzie on zawsze aktualny.

### Uaktualnianie systemu

Będzie dla Ciebie dobrą wiadomością, że snapy są aktualizowane automatycznie codziennie. Jeżeli chcesz, możesz aktualizować snapy ręcznie poleceniem `snap refresh`. Zaktualizuje to wszystkie Twoje snapy, chyba że określisz konkretny pakiet w poleceniu.


```bash
$ sudo snap refresh hello
error: cannot refresh "hello": snap "hello" has no updates available
$ sudo snap refresh
core updated
hello 64.75 MB [=====================================>___]   12s

```

Nie są to wszystkie funkcje polecenia snap: możesz bardziej dokładnie śledzić wersje aplikacji, w zależności od tego, jak bardzo chcesz być na bieżąco z nową funkcjonalnością. Jest to możliwe dzięki funkcji kanałów. Możemy zagłębić się w to później.

## Więcej możliwości snapów
Duration: 1:00

### Snapy mogą dodawać więcej niż jedno polecenie

Nasz pierwszy przykład był prosty i zawierał tylko jedno polecenie, ale zwykle pakiety snap zawierają więcej niż jedno polecenie (na przykład zestaw narzędzi umieszczony w jednym snapie). Wszystkie te polecenia należą do przestrzeni nazw takiej samej jak nazwa pakietu. Wykonaj następujące kroki, aby zobaczyć przykład tego w działaniu:


```bash
$ sudo snap install hello-world
0 B / 20.00 KB [_______________________________________________________] 0.00 %

hello-world (stable) 6.3 from 'canonical' installed
$ hello-world
Hello World!
$ hello-world.env
< env variables >
```


positive
: Informacja: pierwsze polecenie nie posiada przedrostka, jeżeli jest takie samo jak nazwa pakietu. To dlatego, że snapy mogą posiadać jedno domyślne polecenie.

### Snap może również zawierać usługi

Snapy mogą zawierać ogólnosystemowe usługi. Jeżeli zainstalujesz pakiet **shout** (webowy klient IRC), możesz wypróbować tą opcję w działaniu – po prostu przejdź do adresu [http://localhost:9000/] w przeglądarce, aby skorzystać z usługi.

Usługi snapów są uruchamiane/zatrzymywane przy uruchamianiu/wyłączaniu systemu. Mogą zostać skonfigurowane, aby uruchamiały się na żądanie.

### Usuwanie snapów

Usunięcia snapa wymaga tylko jednego polecenia, wszystko co musisz zrobić to `snap remove <snap name>`. W naszym przypadku jest to:


```bash
$ sudo snap remove hello-world

hello-world removed
```

Łatwo i przejrzyście, nic po nim nie pozostało! Kod aplikacji, jej zależności i dane użytkownika utworzone przez pakiet są usuwane. Jeżeli snap zawiera usługę, zostanie ona wyłączona i usunięta.


## Korzystanie z wersji i kanałów
Duration: 2:00

Programiści mogą wydawać wersje stabilne, kandydujące do stabilnej, beta i niestabilne snapów w tym samym czasie, aby zaangażować społeczność, która chciałaby testować nadchodzące zmiany. Możesz wybrać, z którego kanału będziesz korzystać.

Domyślnie, snapy są instalowane z kanału `stable`. Zgodnie z konwencją, programiści korzystają z kanału `candidate` aby dostarczać nadchodzącą wersję stabilną, pozwalając na przetestowanie jej. Kanał `beta` zawiera nieukończone, ale znaczące zmiany, kanał `edge` jest zwykle używany dla regularnych lub dziennych kompilacji, które pomyślnie skompilowano.

### Zmiana kanału zainstalowanej aplikacji


```bash
$ sudo snap refresh hello --channel=beta

hello (beta) 2.10.1 from 'canonical' refreshed
```

Możesz teraz uruchomić wersję beta pakietu i sprawdzić, czy działa tak samo:


```bash
$ hello
Hello, snap padawan!
```

`snapd` podąża teraz za kanałem `beta` pakietu `hello` i pobierze każde aktualizacje udostępniane za jegi pośrednictwem.


```bash
Możesz też zainstalować pakiet bezpośrednio z pakietu beta poleceniem
`$ sudo snap install hello --beta`
```

positive
: Możesz również użyć polecenia `snap switch`, aby zmienić kanał bez wymuszenia aktualizacji.

### Odwróć zmiany, jeśli coś poszło nie tak!

Jedną z możliwości `snapd` jest funkcja pozwalająca na powrót do poprzedniej wersji aplikacji (wraz z danymi powiązanymi ze snapem) z dowolnego powodu:


```bash
$ sudo snap revert hello

hello reverted to 2.10
$ hello
Hello, world!
```

Dzięki wbudowanemu systemowi przywracania zmian, możesz bez obaw dokonywać aktualizacji wiedząc, że będziesz mieć możliwość powrotu do poprzedniego stanu!


## To już wszystko!
Duration: 1:00

### Proste, prawda?

Gratulujemy! Udało Ci się!

Umiesz już szukać snapów w sklepie, instalować i aktualizować je, zmieniać kanały i wiele więcej. Polecenie `snap` zostało zaprojektowane, aby być tak proste i zapamiętywalne jak to możliwe. Po kilku użyciach, korzystanie z niego będzie dla Ciebie banalne.

### Następne kroki

  - Zapoznaj się w bardziej zaawansowane funkcje i możliwości snapów czytając poradnik „[Advanced snap usage]”.
  - Zaskocz się tym, jak łatwo możesz utworzyć własnego snapa po przeczytaniu „[Creating your first snap]”.
  - Dołącz do społeczności snapcraft.io na [forum snapcrafta].

### Do przeczytania później

  - [Dokumentacja snapcraft.io] jest dobrym miejscem, w którym przeczytasz pełną dokumentację snapa i snapcrafta.
  - Dowiedz się, jak [skontaktować się z nami i szerszą społecznością].





[snap]: http://snapcraft.io/
[gentoo-snappy overlay]: https://github.com/zyga/gentoo-snappy
[snap meta layer]: https://github.com/morphis/meta-snappy/blob/master/README.md
[snap-openwrt feed]: https://github.com/teknoraver/snap-openwrt/blob/master/README.md
[http://localhost:9000/]: http://localhost:9000/
[Advanced snap usage]: https://tutorials.ubuntu.com/tutorial/advanced-snap-usage
[Creating your first snap]: https://tutorials.ubuntu.com/tutorial/create-your-first-snap
[forum snapcrafta]: https://forum.snapcraft.io/
[Dokumentacja snapcraft.io]: http://snapcraft.io/docs/
[skontaktować się z nami i szerszą społecznością]: http://snapcraft.io/community/
