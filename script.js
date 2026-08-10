
    const translations = {
      en: {
        subtitle: "Random pitch suggestions for multi-pitch UTAU voicebanks",
        genderTitle: "Gender",
        maleLabel: "Male",
        femaleLabel: "Female",
        pitchCountTitle: "Number of Pitches",
        avoidSharpsLabel: "Avoid sharps (#)",
        generatedPitchesTitle: "Generated Pitches",
        addNumbersLabel: "Add numbers when creating folders (e.g. 01_C4, 02_E4...)",
        generateButton: "Generate",
        confirmButton: "Confirm & Create Folders",
        noFolderSupport: "Folder creation is not supported by this browser.",
        foldersCreated: "Folders created",
        folderCreationFailed: "Failed to create folders",
        versionText: "v1.12: 2–4 Pitches / Gender Range / Avoid Sharps / Folder Numbering"
      },
      ja: {
        subtitle: "多音階UTAU音源向けのランダム音階提案ツール",
        genderTitle: "性別",
        maleLabel: "男性",
        femaleLabel: "女性",
        pitchCountTitle: "音階数",
        avoidSharpsLabel: "♯を避ける",
        generatedPitchesTitle: "生成された音階",
        addNumbersLabel: "フォルダ作成時に番号を付ける（例：01_C4、02_E4…）",
        generateButton: "生成",
        confirmButton: "確定してフォルダを作成",
        noFolderSupport: "このブラウザではフォルダ作成に対応していません。",
        foldersCreated: "フォルダを作成しました",
        folderCreationFailed: "フォルダを作成できませんでした",
        versionText: "v1.12: 2～4音階 / 性別別音域 / ♯回避 / フォルダ番号"
      },
      zh: {
        subtitle: "为多音阶UTAU音源提供随机音阶建议",
        genderTitle: "性别",
        maleLabel: "男声",
        femaleLabel: "女声",
        pitchCountTitle: "音阶数",
        avoidSharpsLabel: "规避升号（#）",
        generatedPitchesTitle: "生成的音阶",
        addNumbersLabel: "创建文件夹时添加编号（例：01_C4、02_E4…）",
        generateButton: "生成",
        confirmButton: "确认并创建文件夹",
        noFolderSupport: "此浏览器不支持创建文件夹。",
        foldersCreated: "文件夹创建完成",
        folderCreationFailed: "文件夹创建失败",
        versionText: "v1.12: 2～4音阶 / 男女声音域 / 规避升号 / 文件夹编号"
      }
    };

    let currentLanguage = "zh";

    function applyLanguage(lang) {
      currentLanguage = lang;
      const t = translations[lang];

      document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;

      document.getElementById("subtitle").textContent = t.subtitle;
      document.getElementById("genderTitle").textContent = t.genderTitle;
      document.getElementById("maleLabel").textContent = t.maleLabel;
      document.getElementById("femaleLabel").textContent = t.femaleLabel;
      document.getElementById("pitchCountTitle").textContent = t.pitchCountTitle;
      document.getElementById("avoidSharpsLabel").textContent = t.avoidSharpsLabel;
      document.getElementById("generatedPitchesTitle").textContent = t.generatedPitchesTitle;
      document.getElementById("addNumbersLabel").textContent = t.addNumbersLabel;
      document.getElementById("generateButton").textContent = t.generateButton;
      document.getElementById("confirmButton").textContent = t.confirmButton;

      document.querySelectorAll(".language-button").forEach(button => {
        button.classList.toggle("active", button.dataset.lang === lang);
      });
    }

    document.querySelectorAll(".language-button").forEach(button => {
      button.addEventListener("click", () => {
        applyLanguage(button.dataset.lang);
      });
    });

let generatedPitches = [];

    function midiToPitch(midiNum) {
      const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
      const octave = Math.floor(midiNum / 12) - 1;
      return `${noteNames[midiNum % 12]}${octave}`;
    }

    function generatePitches(gender, pitchCount, avoidSharps) {
      let baseNote;
      const r = Math.random();

      if (gender === "female") {
        // v1.12: female base range lowered by one semitone.
        // 67% F#3 (54), 33% G3 (55).
        baseNote = r < 0.67 ? 54 : 55;
      } else {
        // 67% A2 (45), 33% G#2 (44).
        baseNote = r < 0.67 ? 45 : 44;
      }

      // For a 2-pitch voicebank, generate the standard 3-pitch range
      // and use pitches 2 and 3 so the result does not skew too low.
      const totalPitches = pitchCount === 2 ? 3 : pitchCount;

      let currentNote = baseNote;
      const pitches = [];

      for (let i = 0; i < totalPitches; i++) {
        // Keep the original 3–4 semitone interval rule.
        currentNote += Math.floor(Math.random() * 2) + 3;

        // If requested, move sharp notes up to the next natural note.
        if (avoidSharps) {
          const noteIndex = currentNote % 12;
          if ([1, 3, 6, 8, 10].includes(noteIndex)) {
            currentNote += 1;
          }
        }

        // Preserve the original upper-range limits:
        // Female max C5, Male max D4.
        const currentPitchName = midiToPitch(currentNote);
        if (gender === "female" && currentPitchName === "D5") {
          currentNote -= 2;
        } else if (gender === "male" && currentPitchName === "E4") {
          currentNote -= 2;
        }

        pitches.push(midiToPitch(currentNote));
      }

      return pitchCount === 2 ? pitches.slice(1) : pitches;
    }

    function getSelectedValue(name) {
      return document.querySelector(`input[name="${name}"]:checked`).value;
    }

    const generateButton = document.getElementById("generateButton");
    const confirmButton = document.getElementById("confirmButton");
    const pitchResult = document.getElementById("pitchResult");
    const message = document.getElementById("message");

    generateButton.addEventListener("click", () => {
      const gender = getSelectedValue("gender");
      const pitchCount = Number(getSelectedValue("pitchCount"));
      const avoidSharps = document.getElementById("avoidSharps").checked;

      generatedPitches = generatePitches(gender, pitchCount, avoidSharps);
      pitchResult.textContent = generatedPitches.join(", ");
      message.textContent = "";
      confirmButton.disabled = false;
    });

    confirmButton.addEventListener("click", async () => {
      if (!generatedPitches.length) {
        return;
      }

      if (!("showDirectoryPicker" in window)) {
        message.textContent = translations[currentLanguage].noFolderSupport;
        return;
      }

      try {
        const directoryHandle = await window.showDirectoryPicker();

        const addNumbers = document.getElementById("addNumbers").checked;
        const folderNames = generatedPitches.map((pitch, index) =>
          addNumbers ? `${String(index + 1).padStart(2, "0")}_${pitch}` : pitch
        );

        for (const folderName of folderNames) {
          await directoryHandle.getDirectoryHandle(folderName, { create: true });
        }

        alert(`${translations[currentLanguage].foldersCreated}: ${folderNames.join(", ")}`);
        message.textContent = "";
        generatedPitches = [];
        pitchResult.textContent = "—";
        confirmButton.disabled = true;
      } catch (error) {
        if (error.name !== "AbortError") {
          message.textContent = `${translations[currentLanguage].folderCreationFailed}: ${error.message}`;
        }
      }
    });


    applyLanguage("zh");
