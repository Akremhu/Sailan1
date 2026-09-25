/* =========================================================
   WEDDING INVITATION — SCRIPT
   الدكتور أكرم عبدالخالق سيلان
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const WEDDING = {
        groom: "الدكتور أكرم عبدالخالق سيلان",
        shortName: "الدكتور أكرم سيلان",

        date: "2026-10-15",
        time: "13:30",

        // Yemen = UTC+03:00
        dateTime: "2026-10-15T13:30:00+03:00",

        venue: "صالة بيت سيلان، بيت سيلان - خمر",
        mapsQuery: "صالة بيت سيلان خمر عمران اليمن"
    };


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const cover = document.getElementById("invitation-cover");
    const app = document.getElementById("wedding-app");

    const openButton = document.getElementById("open-invitation");
    const shareButton = document.getElementById("share-button");
    const musicButton = document.getElementById("music-button");

    const audio = document.getElementById("wedding-audio");

    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    const countdownMessage =
        document.getElementById("countdown-message");

    const mapsButton =
        document.getElementById("maps-button");

    const calendarButton =
        document.getElementById("calendar-button");

    const rsvpForm =
        document.getElementById("rsvp-form");

    const rsvpMessage =
        document.getElementById("rsvp-message");


    /* =====================================================
       OPEN INVITATION
       ===================================================== */

    function openInvitation() {
        if (!cover || !app) return;

        cover.classList.add("hidden");
        app.classList.add("visible");

        document.body.classList.remove("locked");

        // Allow browser to start animations after opening
        setTimeout(() => {
            initializeRevealAnimation();
        }, 350);

        // Try audio only after explicit user interaction
        if (audio) {
            audio.volume = 0.45;

            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    updateMusicButton(false);
                });
            }
        }
    }

    if (openButton) {
        openButton.addEventListener("click", openInvitation);
    }


    /* =====================================================
       MUSIC
       ===================================================== */

    function updateMusicButton(isPlaying) {
        if (!musicButton) return;

        musicButton.setAttribute(
            "aria-label",
            isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"
        );

        musicButton.innerHTML = isPlaying
            ? "❚❚"
            : "♪";
    }

    if (audio) {
        audio.addEventListener("play", () => {
            updateMusicButton(true);
        });

        audio.addEventListener("pause", () => {
            updateMusicButton(false);
        });
    }

    if (musicButton && audio) {
        musicButton.addEventListener("click", async () => {
            try {
                if (audio.paused) {
                    await audio.play();
                } else {
                    audio.pause();
                }
            } catch (error) {
                updateMusicButton(false);
            }
        });
    }


    /* =====================================================
       COUNTDOWN
       ===================================================== */

    const weddingDate =
        new Date(WEDDING.dateTime).getTime();

    function pad(number) {
        return String(number).padStart(2, "0");
    }

    function updateCountdown() {
        const now = Date.now();
        const difference = weddingDate - now;

        if (difference <= 0) {
            if (daysElement) daysElement.textContent = "00";
            if (hoursElement) hoursElement.textContent = "00";
            if (minutesElement) minutesElement.textContent = "00";
            if (secondsElement) secondsElement.textContent = "00";

            if (countdownMessage) {
                countdownMessage.textContent =
                    "حللتم أهلاً ونزلتم سهلاً 🌿";
            }

            return;
        }

        const totalSeconds =
            Math.floor(difference / 1000);

        const days =
            Math.floor(totalSeconds / 86400);

        const hours =
            Math.floor((totalSeconds % 86400) / 3600);

        const minutes =
            Math.floor((totalSeconds % 3600) / 60);

        const seconds =
            totalSeconds % 60;

        if (daysElement) {
            daysElement.textContent = pad(days);
        }

        if (hoursElement) {
            hoursElement.textContent = pad(hours);
        }

        if (minutesElement) {
            minutesElement.textContent = pad(minutes);
        }

        if (secondsElement) {
            secondsElement.textContent = pad(seconds);
        }

        if (countdownMessage) {
            countdownMessage.textContent =
                "ننتظركم بكل محبة في هذه المناسبة السعيدة";
        }
    }

    updateCountdown();

    setInterval(updateCountdown, 1000);


    /* =====================================================
       GOOGLE MAPS
       ===================================================== */

    if (mapsButton) {
        mapsButton.addEventListener("click", () => {
            const query =
                encodeURIComponent(WEDDING.mapsQuery);

            const mapsURL =
                `https://www.google.com/maps/search/?api=1&query=${query}`;

            window.open(
                mapsURL,
                "_blank",
                "noopener,noreferrer"
            );
        });
    }


    /* =====================================================
       SHARE
       ===================================================== */

    if (shareButton) {
        shareButton.addEventListener("click", async () => {

            const shareData = {
                title:
                    `دعوة زفاف ${WEDDING.shortName}`,

                text:
                    `بكل محبة ندعوكم لمشاركتنا فرحة زفاف ${WEDDING.groom} يوم الخميس 15 أكتوبر 2026م، ابتداءً من الساعة 1:30 ظهراً.`,

                url: window.location.href
            };

            try {

                if (
                    navigator.share &&
                    /Android|iPhone|iPad|iPod/i.test(
                        navigator.userAgent
                    )
                ) {
                    await navigator.share(shareData);
                    return;
                }

                await navigator.clipboard.writeText(
                    window.location.href
                );

                showTemporaryMessage(
                    shareButton,
                    "تم نسخ رابط الدعوة"
                );

            } catch (error) {

                // User cancelled share dialog
                if (error?.name === "AbortError") {
                    return;
                }

                fallbackCopy(
                    window.location.href
                );
            }
        });
    }


    /* =====================================================
       COPY FALLBACK
       ===================================================== */

    function fallbackCopy(text) {

        const textarea =
            document.createElement("textarea");

        textarea.value = text;

        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();

        try {
            document.execCommand("copy");

            showTemporaryMessage(
                shareButton,
                "تم نسخ رابط الدعوة"
            );

        } catch (error) {

            showTemporaryMessage(
                shareButton,
                "انسخ الرابط من شريط المتصفح"
            );
        }

        textarea.remove();
    }


    /* =====================================================
       TEMPORARY BUTTON MESSAGE
       ===================================================== */

    function showTemporaryMessage(button, message) {

        if (!button) return;

        const original =
            button.dataset.originalText ||
            button.innerHTML;

        button.dataset.originalText = original;

        button.innerHTML = message;

        setTimeout(() => {
            button.innerHTML = original;
        }, 2200);
    }


    /* =====================================================
       ADD TO CALENDAR
       ===================================================== */

    if (calendarButton) {

        calendarButton.addEventListener(
            "click",
            createCalendarEvent
        );
    }

    function createCalendarEvent() {

        const start =
            "20261015T133000";

        const end =
            "20261015T180000";

        const title =
            `زفاف ${WEDDING.shortName}`;

        const description =
            `دعوة زفاف ${WEDDING.groom}`;

        const location =
            WEDDING.venue;

        const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sailan Wedding//AR//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:sailan-wedding-2026@example.local
DTSTAMP:20260925T000000Z
DTSTART;TZID=Asia/Aden:${start}
DTEND;TZID=Asia/Aden:${end}
SUMMARY:${escapeICS(title)}
DESCRIPTION:${escapeICS(description)}
LOCATION:${escapeICS(location)}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

        const blob =
            new Blob(
                [ics],
                { type: "text/calendar;charset=utf-8" }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "wedding-akram-sailan-2026.ics";

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);
    }

    function escapeICS(value) {
        return String(value)
            .replace(/\\/g, "\\\\")
            .replace(/\n/g, "\\n")
            .replace(/,/g, "\\,")
            .replace(/;/g, "\\;");
    }


    /* =====================================================
       RSVP
       ===================================================== */

    if (rsvpForm) {

        rsvpForm.addEventListener(
            "submit",
            handleRSVP
        );
    }

    function handleRSVP(event) {

        event.preventDefault();

        const formData =
            new FormData(rsvpForm);

        const name =
            String(
                formData.get("name") || ""
            ).trim();

        const guests =
            String(
                formData.get("guests") || "1"
            ).trim();

        const attendance =
            String(
                formData.get("attendance") || ""
            ).trim();

        if (!name) {
            showRSVPMessage(
                "يرجى كتابة الاسم."
            );
            return;
        }

        if (!attendance) {
            showRSVPMessage(
                "يرجى تحديد حالة الحضور."
            );
            return;
        }

        const attendanceText =
            attendance === "yes"
                ? "سأحضر بإذن الله"
                : "أعتذر عن الحضور";

        const message =
`السلام عليكم ورحمة الله وبركاته

تأكيد حضور مناسبة زفاف ${WEDDING.shortName}

الاسم: ${name}
عدد الأشخاص: ${guests}
الحالة: ${attendanceText}

الخميس 15 أكتوبر 2026م
الساعة 1:30 ظهراً
${WEDDING.venue}`;

        /*
         * لا يتم تخزين بيانات الضيوف محلياً
         * ولا يتم الادعاء بوجود قاعدة بيانات.
         *
         * يمكن لاحقاً ربط هذا النموذج بواتساب
         * أو API / قاعدة بيانات حقيقية.
         */

        copyText(message)
            .then(() => {

                showRSVPMessage(
                    "تم تجهيز رسالة تأكيد الحضور ونسخها. يمكنك إرسالها عبر واتساب."
                );

            })
            .catch(() => {

                showRSVPMessage(
                    message
                );
            });
    }


    /* =====================================================
       RSVP MESSAGE
       ===================================================== */

    function showRSVPMessage(message) {

        if (!rsvpMessage) return;

        rsvpMessage.textContent = message;

        rsvpMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    /* =====================================================
       COPY TEXT
       ===================================================== */

    async function copyText(text) {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(text);
            return;
        }

        fallbackCopy(text);
    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    function initializeRevealAnimation() {

        const elements =
            document.querySelectorAll(
                ".section, .occasion-card, .venue-card, .calendar-card, .rsvp-card"
            );

        elements.forEach((element) => {
            element.classList.add("reveal");
        });

        if (!("IntersectionObserver" in window)) {

            elements.forEach((element) => {
                element.classList.add("visible");
            });

            return;
        }

        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        observerInstance.unobserve(
                            entry.target
                        );
                    });

                },
                {
                    threshold: 0.12
                }
            );

        elements.forEach((element) => {
            observer.observe(element);
        });
    }


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    document.body.classList.add("locked");

    updateMusicButton(false);

});
