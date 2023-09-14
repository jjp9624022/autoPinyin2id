import React, { useState } from 'react';
import { WC } from "./WC.jsx";
import{ChangeList} from "./ChangeList.jsx";
export const { app } = require("indesign");
console.log("得到的indesign程序：", app);

// 定义拼音声调对应表
const toneMap = {
    // 'a': 'a0',
    'ā': 'a1',
    'á': 'a2',
    'ǎ': 'a3',
    'à': 'a4',
    // 'e': 'e0',
    'ē': 'e1',
    'é': 'e2',
    'ě': 'e3',
    'è': 'e4',
    // 'o': 'o0',
    'ō': 'o1',
    'ó': 'o2',
    'ǒ': 'o3',
    'ò': 'o4',
    // 'i': 'i0',
    'ī': 'i1',
    'í': 'i2',
    'ǐ': 'i3',
    'ì': 'i4',
    // 'u': 'u0',
    'ū': 'u1',
    'ú': 'u2',
    'ǔ': 'u3',
    'ù': 'u4',
    'ü': 'ü1',
    'ǘ': 'ü2',
    'ǚ': 'ü3',
    'ǜ': 'ü4'
};
const pinyinMap = {
    "a": ["a", "ā", "á", "ǎ", "à"],
    "o": ["o", "ō", "ó", "ǒ", "ò"],
    "e": ["e", "ē", "é", "ě", "è"],
    "i": ["i", "ī", "í", "ǐ", "ì"],
    "ü": ["ü", "ǖ", "ǘ", "ǚ", "ǜ"],
    "u": ["u", "ū", "ú", "ǔ", "ù"],
    "ai": ["ai", "āi", "ái", "ǎi", "ài"],
    "ei": ["ei", "ēi", "éi", "ěi", "èi"],
    "ui": ["ui", "uī", "uí", "uǐ", "uì"],
    "ao": ["ao", "āo", "áo", "ǎo", "ào"],
    "ou": ["ou", "ōu", "óu", "ǒu", "òu"],
    "iu": ["iu", "iū", "iú", "iǔ", "iù"],
    "ie": ["ie", "iē", "ié", "iě", "iè"],
    "üe": ["üe", "üē", "üé", "üě", "üè"],
    "ue": ["ue", "uē", "ué", "uě", "uè"],
    "er": ["er", "èr", "èr", "èr", "èr"],
    "an": ["an", "ān", "án", "ǎn", "àn"],
    "en": ["en", "ēn", "én", "ěn", "èn"],
    "in": ["in", "īn", "ín", "ǐn", "ìn"],
    "ia": ["ia", "iā", "iá", "iǎ", "ià"],
    "iao": ["iao", "iāo", "iáo", "iǎo", "iào"],
    "un": ["un", "ūn", "ún", "ǔn", "ùn"],
    "ün": ["ün", "ūn", "ún", "ǔn", "ùn"],
    "ang": ["ang", "āng", "áng", "ǎng", "àng"],
    "eng": ["eng", "ēng", "éng", "ěng", "èng"],
    "ing": ["ing", "īng", "íng", "ǐng", "ìng"],
    "ong": ["ong", "ōng", "óng", "ǒng", "òng"],
    "uan": ["uan", "uān", "uán", "uǎn", "uàn"],
    "uang": ["uang", "uāng", "uáng", "uǎng", "uàng"],
    "iang": ["iang", "iāng", "iáng", "iǎng", "iàng"],
    "iong": ["iong", "iōng", "ióng", "iǒng", "iòng"],
};

// 定义韵母列表
// const yunmuList = ['a', 'o', 'e', 'i', 'u', 'v', 'ai', 'ei', 'ui', 'ao', 'ou', 'iu', 'ie', 've', 'er', 'an', 'en', 'in', 'un', 'vn', 'ang', 'eng', 'ing', 'ong'];

// 判断字符是否为韵母
function isYunmu(char) {
    const yunmuList = Object.keys(pinyinMap);
    // console.log("字典值", yunmuList);

    for (let i = 0; i < yunmuList.length; i++) {
        const yunmu = yunmuList[i];
        if (char.indexOf(yunmu) === 0) {
            return true;
        }
    }
    return false;
}

// 分割声母和韵母
function splitShengYun(pinyin) {
    let sheng = '';
    let yun = '';
    for (let i = 0; i < pinyin.length; i++) {
        const char = pinyin.charAt(i);
        if (isYunmu(char)) {
            yun = pinyin.substring(i);
            break;
        } else {
            sheng += char;
        }
    }
    return [sheng, yun];
}


// 将拼音转换为带数字声调的拼音
function convertToNumberedTonePinyin(pinyin) {
    let newPinyin = '';
    for (let i = 0; i < pinyin.length; i++) {
        const char = pinyin.charAt(i);
        if (char in toneMap) {
            newPinyin += toneMap[char];
        } else {
            newPinyin += char;
        }
    }

    const numbers = newPinyin.match(/\d+/g)
    const toneIndex = numbers !== null ? numbers.map(Number)[0] : 0
    const result = newPinyin.replace(/\d+/g, '');
    // console.log("得到的PINYIN：", [toneIndex, result, newPinyin]);
    return [toneIndex, result, newPinyin];
}


function convertToMarkedTonePinyin(pinyin, newTone) {
    let tonesInfo = convertToNumberedTonePinyin(pinyin)
    let convertPinyin = ""

    let toneIndex = tonesInfo[0]
    let toneChar = tonesInfo[1]
    if (toneChar !== "") {
        const shengYun = splitShengYun(toneChar)
        try {
            convertPinyin = shengYun[0] + pinyinMap[shengYun[1]][newTone]
        } catch (error) {
            console.log("error", error)
        }
        
        // console.log("声母韵母", shengYun, newPinyin);

    }

    return convertPinyin

}

export function PinyinInput(props) {

    function handleToneChange(event, char, index) {
        // 获取输入的音调
        const tone = event.target.value;
        // convertToMarkedTonePinyin(tone,syllableIndex)
        char.rubyString = tone
        props.setSelection()
        console.log(tone);

    }
    const getAppSelection=props.getAppSelection
    const [isVisible, setIsVisible] = useState(new Array(props.pinyiner.length).fill(false));
    const toggleVisibility = (e) => {
        
        const i = [...isVisible]
        i[e]=!i[e]
        console.log(i);
        setIsVisible(i);
      };

    return (
        <WC>
            <sp-label>声调编辑</sp-label>

            {/* <input id="pinyin-input" type="text" value={pinyiner} onChange={handlePinyinChange} /> */}
            {props.pinyiner.map((s, i) => (
                <React.Fragment key={i}>
                    <sp-divider size="medium"></sp-divider>
                    <sp-label>{s.contents}</sp-label>
                    <select value={s.rubyString} onChange={(e) => handleToneChange(e, s, i)}>
                        <option value={convertToMarkedTonePinyin(s.rubyString, 1)}>一声</option>
                        <option value={convertToMarkedTonePinyin(s.rubyString, 2)}>二声</option>
                        <option value={convertToMarkedTonePinyin(s.rubyString, 3)}>三声</option>
                        <option value={convertToMarkedTonePinyin(s.rubyString, 4)}>四声</option>
                        <option value={convertToMarkedTonePinyin(s.rubyString, 0)}>轻声</option>
                    </select>
                    <input type="text" style={{ width: '40px' }} value={s.rubyString} onChange={(e) => handleToneChange(e, s, i)} />
                    <button onClick={(e) => toggleVisibility(i)}>
        {isVisible[i] ? '关闭' : '全局编辑'}
      </button>
      {isVisible[i] && <ChangeList app={app} char={s} getAppSelection={getAppSelection}></ChangeList>}
                    {i < props.pinyiner.length - 1 && ''}
                </React.Fragment>
            ))}
        </WC>
    );
}


