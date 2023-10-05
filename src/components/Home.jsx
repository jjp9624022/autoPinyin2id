import React, { useState, useRef, useEffect } from 'react';
import pinyin from "pinyin";

import { WC } from "./WC.jsx";
import { PinyinInput, app } from "./PinyinInput.jsx";
import { PinyinWeb } from "./PinyinWeb.jsx";
import "./Home.css";
import useAxios, { configure } from 'axios-hooks'
// import LRU from 'lru-cache'
import Axios from 'axios'


function getAppSelection(inRange) {
    let theRange = inRange.theRange
    let patten = inRange.patten
    // if (!range) {
    //     var range = "selection"
    // }
    // if(!patten){
    //     let patten="~K+"
    // }
    let myArray = [];
    let myTitles = [];
    let selectRange = ["Word", "Character", "Text", "Line"]
    app.findGrepPreferences = 1851876449

    if (app.documents.length <= 0) {
        return [myTitles, myArray]
    }
    //严格化选区
    if (app.selection.length > 0 && theRange == "selection") {
        const configs = app.findGrepPreferences

        // console.log("配置",configs)
        app.findGrepPreferences.findWhat = patten;


        var mySelection = app.selection;
        var myString = "";
        for (var myCounter = 0; myCounter < mySelection.length; myCounter++) {
            myString = mySelection[myCounter].constructor.name
            if (selectRange.indexOf(myString) !== -1) {
                // console.log(myString);


                myTitles = mySelection[myCounter].findGrep()
                for (let i = 0; i < myTitles.length; i++) {
                    for (var m = 0; m < myTitles[i].characters.length; m++) {
                        // myTitles[i].characters.item(m).addEventListener("select",) 
                        myArray.push(myTitles[i].characters.item(m))

                    }
                }
            }
        }
        console.log(myString);
        return [myTitles, myArray];

    } else if (theRange == "document") {
        // if(app.documents.length==0){}
        const doc = app.activeDocument;
        app.findGrepPreferences.findWhat = patten;
        myTitles = doc.findGrep()
        for (let i = 0; i < myTitles.length; i++) {
            for (var m = 0; m < myTitles[i].characters.length; m++) {
                // myTitles[i].characters.item(m).addEventListener("select",) 
                myArray.push(myTitles[i].characters.item(m))

            }
        }

        return [myTitles, myArray]
    } else {
        return [myTitles, myArray]
    }


    console.log("查找到的文本", myArray);
    return [myTitles, myArray];
}
const axios = Axios.create({
    baseURL: 'http://nas.zhijianstudio.ink',
    method: "POST",
    charset: 'utf-8',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Token ' + token
    }

})
configure({ axios })
// const child=forwardRef(PinyinInput)
export const Home = () => {
    const [pinyiner, setPinyiner] = useState([]);
    const [range, setRange] = useState({ theRange: "selection", patten: "~K+" });
    const [selectRange, setSelectRange] = useState();
    const [isUpdata, setUpdata] = useState([]);
    const [{ data, loading, error }, getToneData] = useAxios("/guess/", { manual: true })
    // const cRef = useRef(null);
    useEffect(() => {
        if (pinyiner) {
            const mutitone = pinyiner.map((m) => pinyin(m.contents, {

                heteronym: true,              // 启用多音字模式
                segment: true,                // 启用分词，以解决多音字问题。默认不开启，使用 true 开启使用 nodejieba 分词库。

            })[0].length <= 1)
            console.log("mutitone", mutitone)
            setUpdata(mutitone)

        }


    }, [selectRange])

    function handleGuessToneData(event) {
        let text = ""
        for (let t in pinyiner) {
            text += pinyiner[t].contents
        }
        // 获取数据
        console.info("下载", text)
        getToneData({

            data: {

                owner: 'test',
                textContents: text,

            },
            // params: {
            //     item_id : props.char.contents
            //   },
        })
    }
    useEffect(() => {
        if (data) {
            console.log("data", data)
            for (var i in data.guess) {

                pinyiner[data.guess[i][1]].rubyString = data.guess[i][0]
                setPinyiner(pinyiner)
            }


        }


    }, [data])

    function addPinyin(range) {
        console.log("range?", range);

        var myTitles = getAppSelection(range)[0];
        //展开？
        // myTitles

        console.log("查找到的title文本", myTitles);
        for (let i = 0; i < myTitles.length; i++) {


            var pinyinchars = pinyin(myTitles[i].contents, {
                heteronym: true,              // 启用多音字模式
                segment: true,                // 启用分词，以解决多音字问题。默认不开启，使用 true 开启使用 nodejieba 分词库。
            })
            // console.log("字符长度", pinyinchars)
            if (myTitles[i].constructorName == "Character") {
                myTitles[i].rubyFlag = true;
                console.log("拼音数据", pinyinchars)
                myTitles[i].rubyString = pinyinchars[0][0]

                continue
            }

            for (var m = 0; m < myTitles[i].characters.length; m++) {
                // console.log("字符", myTitles[i].characters.item(m))
                myTitles[i].characters.item(m).rubyFlag = true;
                // alert(pinyinchars[m])
                myTitles[i].characters.item(m).rubyString = pinyinchars[m][0];
                // console.log("拼音", myTitles[i].characters.item(m))

            }

        }

    }



    // function getSelection() {

    //     // console.log("获取选区", getAppSelection(range))
    //     // forceUpdate();
    //     // 这里为了避免负效应太多，直接传递给不需要做同步更新的值
    //     // cRef.current && cRef.current.flushData()
    //     // const selected=getAppSelection({ theRange: "selection", patten: "~K+" })
    //     return getAppSelection({ theRange: "selection", patten: "~K+" })[1]

    // }
    function handleSelectionChange() {
        // update

        try {
            const selected = getAppSelection({ theRange: "selection", patten: "~K+" })
            setSelectRange(selected[0])
            setPinyiner(selected[1])

        } catch (error) {
            console.log(error)
        }

    }

    function handleClick() {

        addPinyin(range)
    }

    function handleChange(event) {
        setRange({ theRange: event.target.value, patten: range.patten })
        // co.pattennsole.log("选择的项目", event.target.value)
    }
    if(error){console.log(error)}

    return (
        <div>
            <WC>
                {/* <p className="display">Congratulations! You just created your first React Plugin.!!!!!</p> */}


                <sp-button variant="primary" onClick={handleClick}>生成拼音</sp-button>

                <PinyinWeb range={range} getAppSelection={getAppSelection}></PinyinWeb>

                <sp-divider size="medium"></sp-divider>
                <sp-radio-group selected="selection" onClick={(e) => handleChange(e)}>
                    <sp-label slot="label">生成范围</sp-label>

                    <sp-radio value="document" >文档</sp-radio>
                    <sp-radio value="selection" Checked="true">选区</sp-radio>
                </sp-radio-group>
                <sp-divider size="medium"></sp-divider>

                <sp-button variant="primary" onClick={handleSelectionChange}>选区编辑</sp-button>
                <sp-button variant="primary" onClick={handleGuessToneData}>自动样本填充更改</sp-button>
                {loading && <p>Loading...</p>}
                {error && <p>Error!!!</p>}
                <PinyinInput className="display" pinyiner={pinyiner} setSelection={handleSelectionChange} selectRange=
                    {selectRange} setPinyiner={setPinyiner} getAppSelection={getAppSelection} range={range} isUpdata={isUpdata} setUpdata={setUpdata} />
            </WC>
        </div>
    );
}
