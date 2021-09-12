const _ISLOGGEDKEY = "notesIsLogged";
const _USERLOGGEDKEY = "notesUserLogged";
const _DEFAULTPFP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABeCAYAAAA336rmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADlSURBVHhe7dExAQAwDMCgCWj9y+1scORAAW9mL4YyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpA1IGpAxIGZAyIGVAyoCUASkDUgakDEgZkDIgZUDKgJQBKQNSBqQMSBmQMiBlQMqAlAEpg7H3AU/beRBUx2yaAAAAAElFTkSuQmCC";
const _CHANGESETPROP = ["userPfpChk", 'userNickChk', 'userMobileChk'];
const _INDEXEDDBNAME = "localUserNoteDB";
const _INDEXEDSTORENAME = ["localNotesOS", "noteImageOS"];

let _DATABASE=[{title: "test", body: JSON.stringify({"ops":[{"insert":"test\n"}]}), editable: false, locked: false, lockedPass: null, id:0, user: "affafu", date: { month: 0, day: 25, year: 2021}, lastUpdated: { month: 3, day: 15, year: 2021}},
{title: "test1", body: JSON.stringify({"ops":[{"insert":"test1\n"}]}), editable: false, locked: true, lockedPass: "123", id:1, user: "affafu", date: { month: 2, day: 27, year: 2021}, lastUpdated: { month: 2, day: 29, year: 2021}},
{title: "test2", body: JSON.stringify({"ops":[{"insert":"test2\n"}]}), editable: false, locked: true, lockedPass: "123", id:0, user: "barrys", date: { month: 2, day: 28, year: 2021}, lastUpdated: null}];

// let local_DATABASE = [{title: "testingminefam3", body: "testingminefam3", editable: false, id:0, user: "localUser", date: { month: 2, day: 25, year: 2020}, lastUpdated: null}]
let noteList = null;
let user_DATABASE=[{
    username: "affafu",
    email: "affafu@gmail.com",
    mobile: null,
    pfp: "default",
    nickname: "plop"
},{
    username: "barrys",
    email: "barry@gmail.com",
    mobile: null,
    pfp: "default",
    nickname: null
}];

let login_DATABASE=[{
    username: "affafu",
    password: "affafuPass",
},{
    username: "barrys",
    password: "barryPass",
}]

let userProfileChange_DATABASE=[{
    username: "affafu",
    pfpLast: {month: 12, day: 5, year: 2020},
    nickLast: {month: 12, day: 5, year: 2020}
},
{
    username: "barrys",
    pfpLast: {month: 1, day: 8, year: 2021},
    nickLast: {month: 1, day: 8, year: 2021}
}
]

let titleInput, bodyInput;
let prevTitleInput, prevBodyInput;
let prevEditable, prevLocked;
let userName, userPass, userEmail;
let sideInput;
let userMobile, userNickName;
let _userMobile, _userNickName;
let editable = false;
let isLocked = false;
let isLockedPass = null;
let saveLocalChk = false;
let clickingCheck = false;
let currentOpenID = null;
let currentUser = null;
let currentFile = null;
let changedSettingsChk = 
    {
        userPfpChk: false,
        userNickChk: false,
        userMobileChk: false
    }; 
let clickedChk = false;
let keyPress = null;
let isSavedAlready = false;
let promptInp = null;
let promptBtnInp = null;

const orderList = (whichOrder) => {
    
    let newNoteList = null;

    if(whichOrder === "ascendCreated"){
        newNoteList = ascendCreated(noteList);
    }else if(whichOrder === "descendCreated"){
        newNoteList = descendCreated(noteList);
    }else if(whichOrder === "ascendEdited"){
        newNoteList = ascendEdited(noteList);
    }else if(whichOrder === "descendEdited"){
        newNoteList = descendEdited(noteList);
    }else{
        localList = noteList.filter(note => note.username === 'localUser');
        dbList = noteList.filter(note => note.username !== 'localUser');

        localList.length !== 1 ? localList = ascendCreated(localList) : "";
        dbList.length !== 1 ? dbList = ascendCreated(dbList) : "";
        noteList = localList.concat(dbList);
    }

    newNoteList ? nodeLoad(newNoteList) : nodeLoad(noteList);
}

const ascendCreated = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            return totalDate(a.date_created.day, a.date_created.month, a.date_created.year) - totalDate(b.date_created.day, b.date_created.month, b.date_created.year);
        }
    );
}

const descendCreated = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            return totalDate(b.date_created.day, b.date_created.month, b.date_created.year) - totalDate(a.date_created.day, a.date_created.month, a.date_created.year);
        }
    );
}

const ascendEdited = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            let aTotal, bTotal;

            aTotal = dateEditedCheck(a)
            bTotal = dateEditedCheck(b);

            return aTotal - bTotal;
        }
    )
}

const descendEdited = arrayDbase => {
    return arrayDbase.sort(
        function(a,b){
            let aTotal, bTotal;

            aTotal = dateEditedCheck(a)
            bTotal = dateEditedCheck(b);

            return bTotal - aTotal;
        }
    )
}

const dateEditedCheck = ({last_updated, date_created}) => {
    let total;

    if(last_updated){
        total = totalDate(last_updated.day, last_updated.month, last_updated.year);
    }else{
        total = totalDate(date_created.day, date_created.month, date_created.year);
    }

    return total;
}

const totalDate = (day, month,year) => {
    return ((day + ((month + 1) * 30.4) + (year * 365)))
}

const dateNowGet = () => {
    const d = new Date();
    let newDate = {};
    newDate.year =  d.getFullYear();
    newDate.month = d.getMonth();
    newDate.day = d.getDate();

    return newDate;
}

const logInUserValidate = (localUserID = null) => {
    return new Promise((resolve, reject) => {
        if(userName && userPass || localUserID){
            // fetching login data from backend
            new Promise((resolve, reject) => {
                if(localUserID){
                    // fetch('http://127.0.0.1:5000/user/profile-date-get', {
                    //     method: 'POST',
                    //     mode: 'cors',
                    //     headers: {
                    //         'Content-Type': 'application/json'
                    //     },
                    //     body: JSON.stringify({
                    //         userid: localUserID
                    //     })
                    // })
                    fetch(`http://127.0.0.1:5000/user/profile-date-get/?userid=${localUserID}`, {
                        method: 'GET',
                        mode: 'cors'
                    })
                    .then(resp => {
                        if(resp.ok){
                            return resp.json();
                        }else{
                            throw resp;
                        }
                    })
                    .then(userProfileGet => resolve(userProfileGet))
                    .catch(errData => errData.json().then(({errorMessage}) =>reject({errorMessage})))
                }else{
                    fetch('http://127.0.0.1:5000/user/login', {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: userName,
                            password: userPass
                        })
                    })
                    .then(resp=>{
                        if(resp.ok){
                            return resp.json();
                        }else{
                            throw resp;
                        }
                    })
                    .then(userProfileDate => resolve(userProfileDate))
                    .catch(errData => errData.json().then(({errorMessage})=>reject(errorMessage)))
                }

            }).then(({userid, pfp_last, nick_last}) => {
                indexedDBGetData(_INDEXEDSTORENAME[1], userid).then(data => {
                    if(data.target.result){
                    // entry exists, therefore we compare dates to check if local data is updated
                        let indexedPfpLast = data.target.result.pfp_data.pfp_last;
                        let indexedNickLast = data.target.result.nick_data.nick_last;
                        let whichUpdated = {pfp: false, nick: false};


                        if(totalDate(indexedPfpLast) !== totalDate(pfp_last)){
                            whichUpdated.pfp = true;
                        }

                        if(totalDate(indexedNickLast) !== totalDate(nick_last)){
                            whichUpdated.nick = true;
                        }

                        if(whichUpdated.pfp === true || whichUpdated.nick === true){
                            // fetch('http://127.0.0.1:5000/user/profile-get',{
                            //     method: 'POST',
                            //     mode: 'cors',
                            //     headers: {
                            //         'Content-Type': 'application/json'
                            //     },
                            //     body: JSON.stringify({userid})
                            // })
                            fetch(`http://127.0.0.1:5000/user/user-get?userid=${userid}`, {
                                method: 'GET',
                                mode: 'cors'
                            })
                            .then(resp => {
                                if(resp.ok){
                                    return resp.json()
                                }else{
                                    throw resp;
                                }
                            })
                            .then(({username, pfp, nickname, email, mobile}) => {
                                let updateUserProfile = {
                                    username,
                                    userid,
                                    pfp_data: {
                                        pfp,
                                        pfp_last
                                    },
                                    nick_data: {
                                        nickname,
                                        nick_last
                                    },
                                    mobile,
                                    email
                                }
                                resolve(updateUserProfile);
                            })
                            .catch(errData => errData.json().then(({errorMessage})=>reject(errorMessage)))
                        }else{
                            // local entry is updated
                            resolve(data.target.result);
                        }
                    }else{
                    // entry doesn't exist in the store, therefore we create it
                        // fetch('http://127.0.0.1:5000/user/profile-get',{
                        //     method: 'POST',
                        //     mode: 'cors',
                        //     headers: {
                        //         'Content-Type': 'application/json'
                        //     },
                        //     body: JSON.stringify({userid})
                        // })
                        fetch(`http://127.0.0.1:5000/user/user-get?userid=${userid}`,{
                            method: 'GET',
                            mode: 'cors'
                        })
                        .then(resp => {
                            if(resp.ok){
                                return resp.json();
                            }else{
                                throw resp;
                            }
                        })
                        .then(({username, pfp, nickname, email, mobile}) => {
                            let newUserProfile = {
                                username,
                                userid,
                                pfp_data: {
                                    pfp,
                                    pfp_last
                                },
                                nick_data: {
                                    nickname,
                                    nick_last
                                },
                                mobile,
                                email
                            }

                            indexedDBTerminal(_INDEXEDSTORENAME[1], newUserProfile, 'add').finally(()=>{
                                resolve(newUserProfile);
                            })
                        }).catch(errData=>errData.json().then(({errorMessage})=>reject(errorMessage)))
                    }
                })
            }).catch(err=>{
                reject(err)
            })
        }else{
            // alert("Please fill out area");
            reject("Please fill out area");
        }
    })
}

const userLogInOut = loggingIn => {
    const btn1 = document.querySelector(".loginBtn");
    const btn2 = document.querySelector(".loginRegisterMenuBtn:nth-child(2) button");
    const userPanel = document.querySelector("nav .userPanel");
    const userNavBtns = document.querySelector("nav ul:nth-child(2)");


    userPanel.classList.toggle("animAct");

    btn1.disabled = loggingIn;
    btn1.classList.toggle("hiddenSection");
    btn1.parentNode.classList.toggle("disabled");
    userNavBtns.classList.toggle("loggedInUL");
    btn2.classList.toggle("registerBtn");
    btn2.classList.toggle("userPanelBtn");

    if(loggingIn){
        const imgCon = document.createElement("li");
        const imgIn = document.createElement("img");

        imgCon.classList.add("pfpContainer");
        imgCon.classList.add("nonProfilePfp");
        imgIn.setAttribute("alt","profile picture");
        imgIn.classList.add("pfp");

        imgCon.appendChild(imgIn);
        userNavBtns.appendChild(imgCon);

        currentUser.nick_data.nickname ? panelBtnChange(currentUser.nick_data.nickname) : panelBtnChange(currentUser.username);

        currentUser.pfp_data.pfp === 'default' ? pfpNavChange(_DEFAULTPFP) : pfpNavChange(currentUser.pfp_data.pfp);
    }else{
        const imgCon = document.querySelector(".pfpContainer.nonProfilePfp");
        const imgIn = document.querySelector(".pfpContainer.nonProfilePfp .pfp");

        imgCon.removeChild(imgIn);
        imgCon.parentNode.removeChild(imgCon);

        btn2.textContent = "Register";
        currentUser=null;
    }
    nodeLoad();
}

const registerUserValidate = () =>{
    let returnVar = true;

    if(!userName || !userPass || !userEmail) {
        returnVar=false;
        // alert("Please fill out every textbox");
        promptHandler("alert", "Please fill out every textbox");
    }else{
        if(!passwordCheck(userPass)){
            returnVar=false;
            // alert("Password needs to be 6 characters or longer and have one uppercase letter");
            promptHandler("alert", "Password needs to be 6 characters or longer and have one uppercase letter");
        }else{
            if(userName === "localUser"){
                // alert("Please pick a valid username");
                promptHandler("alert", "Please pick a valid username")
            }else{
                if(userName.length<=5){
                    returnVar=false;
                    // alert("Username needs to be 6 characters or longer");
                    promptHandler("alert","Username needs to be 6 characters or longer")
                }
            }
        }
    }

    return returnVar;
}

const passwordCheck = pass => {
    let returnVar = true;
    let upperCount = 0;
    let lowerCount = 0;

    if(pass.length<=5){
        returnVar = false;
    }else{
        [...pass].forEach(lett => {
            if(lett.toLowerCase() !== lett.toUpperCase()){
                if(lett === lett.toUpperCase()){
                    upperCount++;
                }
                if(lett === lett.toLowerCase()){
                    lowerCount++;
                }
            }
        });
        if(lowerCount<1 || upperCount<1){
            returnVar = false;
        }
    }


    return returnVar;
}

const registerUser = user => {
    return new Promise((resolve, reject) => {
        fetch('http://127.0.0.1:5000/user/register',{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(user)
        })
        .then(resp=>{
            if(resp.ok){
                resolve();
            }else{
                throw resp;
            }
        })
        .catch(errData=>errData.json().then(({errorMessage})=>reject(errorMessage)))
    })
}

const userTerminal = () => {
    if(document.querySelector(".emailContainer").classList.contains("hiddenSection")){
        logInUserValidate().then(userResp => {
            currentUser = userResp;
            accountLogged(true);
            userLogInOut(true);
            closeBtnClicked(".loginRegisterMenu");
        }).catch(errResp => {
            promptHandler("alert", errResp)
            currentUser = null;
            clearInputs(".loginRegisterMenu");
        });
    }else{
        if(registerUserValidate()){
            const username = userName.toLowerCase()
            user = {
                login_data: {
                    password: userPass
                },
                user_data: {
                    username,
                    email: userEmail,
                }
            }

            registerUser(user)
            .then(()=>{
                promptHandler("confirm", "User registered!", false);
                closeBtnClicked(".loginRegisterMenu");
            }).catch(err=>{
                promptHandler('alert', err);
                clearInputs(".loginRegisterMenu");
            })
        }else{
            clearInputs(".loginRegisterMenu");
        }
    }
}

const idStringCut = str => {
    let returnVar;
    str.indexOf("note") === 0 ? returnVar =  "note" : returnVar = "localNote";
    return returnVar;
}

const saveEditableAndLocked = (isEditableChk, prevEditableChk, isLockedChk, prevLockedChk, lockedPassVal) => {
    return new Promise ((resolve) => {
        if(isEditableChk !== prevEditableChk || isLockedChk !== prevLockedChk){
            let whichKind = idStringCut(currentOpenID);
            let id = Number(currentOpenID.replace(whichKind,""));
        
            if(whichKind === "note"){
                fetch('http://127.0.0.1:5000/update-edit-lock',
                {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: id,
                        username: currentUser.username,
                        editable: isEditableChk,
                        locked: isLockedChk,
                        locked_password: lockedPassVal
                    })
                })
                .then(resp => {
                    if(resp.ok){
                        noteList.forEach(note => {
                            if(note.id === id && note.username !== 'localUser'){
                                note.editable === isEditableChk ? "" : note.editable = isEditableChk;
                                note.locked === isLockedChk ? "" : (note.locked = isLockedChk, note.locked_password = isLockedPass);
                            }
                        })
                    }else{
                        throw resp
                    }
                })
                .catch(errData=>errData.json().then(({errorMessage})=>console.log(errorMessage)))
                .finally(()=>resolve())
            }else{
                indexedDBGetData(_INDEXEDSTORENAME[0], id).then(data => {
                    note = data.target.result;
                    note.editable = isEditableChk;
                    note.locked = isLockedChk;
                    note.locked_password = lockedPassVal;
            
                    indexedDBTerminal(_INDEXEDSTORENAME[0], note, "edit")
                    .then(()=>{
                        noteList.forEach(note => {
                            if(note.id === id && note.username === 'localUser'){
                                note.editable === isEditableChk ? "" : note.editable = isEditableChk;
                                note.locked === isLockedChk ? "" : (note.locked = isLockedChk, note.locked_password = isLockedPass);
                            }
                        })
                    })
                    .catch(() => {
                        console.log("Error saving editable/locked");
                        resolve();
                    })
                    .finally(()=>resolve())
                })
             }
        }else{
            resolve();
        }
    })
}

const saveNote = () => {
    // let id = null;
    let locked_password = null;
    let username = "localUser";

    if(currentUser && !saveLocalChk){
        username = currentUser.username;
    }

    isLocked ? locked_password = isLockedPass : "";
    
    isSavedAlready = true;

    _note = {
        username,
        title: titleInput,
        body: bodyInput,
        editable,
        locked: isLocked,
        locked_password
    }

    if(username === "localUser"){
        _note.date_created = dateNowGet()
        _note.lastUpdated = null
        indexedDBTerminal(_INDEXEDSTORENAME[0], _note, "add").then(notes => {
            note_db = noteList.filter(note => note.username !== "localUser");
            noteList = notes.concat(note_db);
            closeBtnClicked(".noteMenu", false);
        })
    }else{
        fetch('http://127.0.0.1:5000/save-note', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(_note)
        })
        .then(resp => {
            if(resp.ok){
                return resp.json();
            }else{
                throw resp;
            }
        })
        .then((note) => {
            noteList.push(note);
        })
        .catch(errData => errData.json().then(({errorMessage})=>promptHandler('alert', errorMessage)))
        .finally(()=>closeBtnClicked(".noteMenu", false))
    }
}

const editNote = () => {
    // editing note
    let id = currentOpenID;
    let titleInputVal = titleInput;
    let bodyInputVal = bodyInput;
    let title, body, last_updated, new_note, edited;
    let whichKind = idStringCut(id);

    id = Number(currentOpenID.replace(whichKind,""));

    noteList.forEach(note => {
        if(whichKind === 'note' && note.username !== 'localUser'){
            if(note.id === id){
                [edited, new_note] = editAndCheck(note.title, note.body, titleInputVal, bodyInputVal, false);
                if(edited){
                    new_note.id = id
                    new_note.username = currentUser.username;
                    fetch('http://127.0.0.1:5000/edit',{
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(new_note)
                    })
                    .then(resp => {
                        if(resp.ok){
                            'title' in new_note ? note.title = new_note.title : ""
                            'body' in new_note ? note.body = new_note.body : ""
                            note.last_updated = dateNowGet();
                        }else{
                            throw resp;
                        }
                    })
                    .catch(errData=>errData.json().then(({errorMessage})=>console.log(errorMessage)))
                    .finally(()=>closeBtnClicked('.noteMenu', true))
                }else{
                    closeBtnClicked('.noteMenu', true)
                }
            }
        }else{
            if(note.id === id && note.username === 'localUser'){
                [title, body, last_updated] = editAndCheck(note.title, note.body, titleInputVal, bodyInputVal, true);
                indexedDBGetData(_INDEXEDSTORENAME[0], id).then(rawData => {
                    if(rawData){
                        data = rawData.target.result;
                        data.title = title;
                        data.body = body;
                        last_updated = last_updated;
                        indexedDBTerminal(_INDEXEDSTORENAME[0], data, 'edit')
                        .then(() => {
                            note.title = title;
                            note.body = body;
                            note.last_updated = last_updated;
                        })
                        .finally(()=>closeBtnClicked('.noteMenu', true))
                    }
                })
            }
        }
    })
}

const editAndCheck = (title, body, titleInputVal, bodyInputVal, fromLocal) => {
    let edited=false;
    let last_updated=null;
    let note = {}

    if(title!==titleInputVal){
        title=titleInputVal;
        edited=true;
        note.title = title
    }

    if(body!==bodyInputVal){
        body=bodyInputVal;
        edited=true;
        note.body = body
    }
    if(fromLocal === true){
        if(edited){
            last_updated = dateNowGet();
        }
        return [title, body, last_updated];
    }else{
        return [edited, note]
    }
}

const deleteNote = () => {
    let id = currentOpenID;

    if(id.indexOf("note")==0){
        id = Number(id.replace("note",""));
        fetch(`http://127.0.0.1:5000/delete?id=${id}&username=${currentUser.username}`,{
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp=>{
            if(resp.ok){
                noteList = noteList.filter(note=>{
                    if(note.username !== currentUser.username){
                        return true;
                    }else{
                        if(note.id !== id){
                            return true;
                        }else{
                            return false;
                        }
                    }
                });
            }else{
                throw resp;
            }
        })
        .catch(errData=>errData.json().then(({errorMessage})=>console.log(errorMessage)))
        .finally(()=>closeBtnClicked('.noteMenu', true))
    }else{
        id = id.replace("localNote","");
        indexedDBTerminal(_INDEXEDSTORENAME[0], id, "del")
        .then(()=>{
            noteList = noteList.filter(note=>{
                if(note.username !== 'localUser'){
                    return true;
                }else{
                    if(note.id !== id){
                        return true;
                    }else{
                        return false;
                    }
                }
            });
        })
        .finally(()=>closeBtnClicked('.noteMenu', true))
    }
}

const createNote = (title=null, id=null, userN=null) => {
    const ul = document.querySelector(".mainArticle .mainList")
    const li = document.createElement("li");
    const h3 = document.createElement("h3");

    if(!id && id!==0){
        title="Double Click here!";
    }else{
        if(!title){
            title="No Title";
        }
    }

    h3.textContent = title;
    li.appendChild(h3);

    if(id===null){
        li.classList.add("defaultNote");
        li.addEventListener("dblclick", clicked);
    }else{
        // turning quill
        // h3 addEventListener opens noteMenu
        // div Quill addEventListener opens bottom part
        const pBody = document.createElement("div");
        pBody.classList.add("listNoteBody");
        pBody.classList.toggle("previewClosed");

        new Quill(pBody, {
            modules: {
                toolbar: false
            },
            placeholder: "Click to see information ▼",
            readOnly: true,
        })

        if(userN!=="localUser"){
            li.setAttribute("data-username", userN);
            li.setAttribute("id","note"+id);
        }else{
            li.setAttribute("data-username", userN);
            li.setAttribute("id","localNote"+id);
        }
        li.appendChild(pBody);
        li.classList.add("userNote");
        h3.addEventListener("click", clicked);
        let handlerFunc = e => {
            e.target.parentNode.parentNode.id ? noteBodyPreview(e.target.parentNode.parentNode.id, handlerFunc) : noteBodyPreview(e.target.parentNode.parentNode.parentNode.id, handlerFunc);
        }
        pBody.addEventListener("click", handlerFunc);
    }

    ul.appendChild(li)
}

const noteBodyPreview = (rawId, handlerFunc) => {
    let whichKind = idStringCut(rawId);
    let id = Number(rawId.replace(whichKind,""));
    let newDelta = {ops: []};
    let noteParti, userVal = "localUser";

    whichKind === "note" ? userVal = currentUser.username : "";

    noteParti = noteList.filter(note => {
        if(note.username === userVal && note.id === id){
            return true;
        }else{
            return false;
        }
    });

    console.log(noteParti)

    let newBody = JSON.parse(noteParti[0].body);

    newDelta = linkCleaning(newBody.ops);

    const noteNode = document.querySelector(`li[id=${rawId}]`);
    noteNode.childNodes[1].classList.toggle("previewClosed");
    noteNode.childNodes[1].removeEventListener("click", handlerFunc);
    let quill = Quill.find(noteNode.childNodes[1]);
    const bottomClose = document.createElement("div");
    const buttonClose = document.createElement("button");

    bottomClose.classList.add("noteCloseContainer");
    buttonClose.classList.add("noteCloseBtn");
    buttonClose.classList.add(`close${rawId}`);
    buttonClose.addEventListener("click", e=> {
        e.preventDefault();
        closeBodyPreview(rawId, quill, handlerFunc, noteNode)
    });
    buttonClose.textContent = "Close preview";
    quill.setContents(newDelta);
    bottomClose.appendChild(buttonClose);
    noteNode.appendChild(bottomClose);
}

const closeBodyPreview = (rawId, quill, handlerFunc, noteNode) => {
    quill.setContents("");
    const closeNoteBtn = document.querySelector(`.noteCloseContainer > .close${rawId}`);
    closeNoteBtn.parentNode.parentNode.removeChild(closeNoteBtn.parentNode)
    noteNode.childNodes[1].addEventListener("click",handlerFunc);
    noteNode.childNodes[1].classList.toggle("previewClosed");
}

const linkCleaning = noteArr => {
    let newDelta = {ops: []};
    let prevLinkCounter = false;

    noteArr.forEach(line => {
        if(line.attributes){
            let returnVar = true;

            if(prevLinkCounter){
                returnVar = false;
                prevLinkCounter = false;
            }

            if(returnVar){
                prevLinkCounter = true;
                line.attributes.link
                newDelta.ops.push(line.attributes.link ? {insert: line.attributes.link} : {insert: line.attributes.alt});
            }
        }else{
            prevLinkCounter ? prevLinkCounter = false : "";
            newDelta.ops.push(line);
        }
    })

    return newDelta;
}

const clearNotes = () => {
    const lists = document.querySelectorAll(".mainArticle ul li");

    lists.forEach(list => {
        list.parentNode.removeChild(list);
    })
}

const nodeLoad = (altDbase = null) => {
    return new Promise((resolve) => {
        clearNotes();

        if(altDbase){
            altDbase.forEach(({id, title, username})=>{
                createNote(title, id, username);
            })
            createNote();
            resolve();
        }else{
            noteList ? noteList = null : "";
            noteList = [];

            let mainDBPromise = new Promise((resolve, reject) => {
                if(currentUser){
                    fetch(`http://127.0.0.1:5000/fetch-all?username=${currentUser.username}`,{
                        method: 'GET',
                        mode: 'cors'
                    })
                    .then(resp=>{
                        if(resp.ok){
                            return resp.json()
                        }else{
                            throw resp
                        }
                    })
                    .then((data) => {
                        resolve(data)
                    })
                    .catch(errData=>errData.json().then(({errorMessage})=>reject(errorMessage)))
                }else{
                    resolve({notes: null})
                }
            })

            Promise.allSettled([mainDBPromise, indexedDBGetAllNoteOS()]).then(data=>{
                
                if(data[1].value.notes !== null){
                    data[1].value.notes.forEach(note => {
                        noteList.push(note);
                    })
                }

                if(data[0].value.notes !== null){
                    data[0].value.notes.forEach(note => {
                        noteList.push(note);
                    })
                }

                noteList.forEach(note => {
                    createNote(note.title, note.id, note.username);
                })
                createNote();
            })
        }
    })
}

//clickedterminal
const clicked = e => {
    e.preventDefault();
    clickedChk = true;

    setTimeout(()=> clickedChk = false, 100);
    
    let btnClass = e.target.classList[0];
    const parent = e.target.parentNode;
    let nodeClass;

    if(btnClass==="addBtn" 
    || btnClass==="editBtn" 
    || btnClass==="closeBtn" 
    || btnClass==="delBtn"  
    || btnClass==="loginregisterFuncBtn" 
    || btnClass==="userPanelBtn" 
    || btnClass==="logOutBtn"
    || btnClass==="saveProfileBtn"
    || btnClass==="clearNickname"
    || btnClass==="sidePanelBtn"){
        nodeClass=btnClass;
    }else{
        if(parent.classList.contains("defaultNote")){
            nodeClass = ".noteMenu";
        }else if(parent.classList.contains("userNote")){
            nodeClass="userNote";
        }else{
            if(btnClass==="userSettingsBtn"){
                nodeClass = "." + btnClass.replace("Btn", "");
            }else{
                nodeClass = "." + parent.className.replace("Btn","");
            }
        }
    }

    if(nodeClass==="addBtn"){
        if(titleInput || bodyInput){
            saveNote();
        }else{
            promptHandler("alert", "Enter either a title or a body first!");
        }
    }else if(nodeClass==="editBtn"){
        editNote();
    }else if(nodeClass==="userNote"){
        currentOpenID = parent.id;
        currentOpenID ? menuClicked(".noteMenu",null) : "";
    }else if(nodeClass==="closeBtn"){
        if(parent.classList.contains("userEdit")){
            closeBtnClicked("."+ parent.classList[0], true);
        }else{
            closeBtnClicked("." + parent.classList[0]);
        }
    }else if(nodeClass==="delBtn"){
        promptHandler("confirm", "Are you sure?");

        let promptInterval = setInterval(() => {
            if(promptBtnInp){
                clearInterval(promptInterval);
                promptBtnInp === 'y' ? deleteNote() : "";
                promptExit();
            }
        }, 100)
    }else if(nodeClass==="loginregisterFuncBtn"){
        //log in button
        userTerminal();
    }else if(nodeClass==="userPanelBtn"){
        activePanel();
    }else if(nodeClass==="logOutBtn"){
        //log out button
        accountLogged(false);
        userLogInOut(false);
        activePanel();
    }else if(nodeClass==="saveProfileBtn"){
        saveProfile();
    }else if(nodeClass==="sidePanelBtn"){
        userMobileNickHandler();
    }else{
        if(nodeClass===".noteMenu"){
            currentOpenID = null;
        }
        menuClicked(nodeClass,e.target.className);
    }
}

const checkingOpenedFrames = () => {
    document.querySelectorAll("section.activeSection").forEach(section=>{
            if(section.classList.contains("userEdit")){
                closeBtnClicked("."+ section.classList[0], true);
            }else{
                closeBtnClicked("." + section.classList[0]);
            }
    })

    if(document.querySelector("aside.userSidePanel").classList.contains("activeSection")){
        menuClicked(".userSidePanel");
    }
}

// mainmenu handler
const menuClicked = (nodeClass, targetClass=null) => {
    nodeClass===".userSidePanel" ? "" : checkingOpenedFrames();

    if(!document.querySelector("ul.userPanel").classList.contains("panelInactive")){
        activePanel();
    }

    if(nodeClass===".loginRegisterMenu"){
        loginRegisterMenuPanelHandler(nodeClass, targetClass);
    }else if (nodeClass===".noteMenu"){
        noteMenuPanelHandler(nodeClass);
    }else if (nodeClass===".userSettings"){
        userSettingsPanelHandler(nodeClass);
    }else if (nodeClass===".userSidePanel"){
        sidePanelHandler(nodeClass, targetClass);
    }
}

const menuToggle = (nodeClass, returnVar = true) => {
    if(returnVar){
        backgroundPanelHandler(nodeClass);
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("activeSection");
    }
}

const promptHandler = (fromWhich, text, defaultConfirm = true) => {
    const dialogBox = document.querySelector("#dialogBox");
    const dialogText = document.querySelector(".dialogText");
    const dialogCancel = document.querySelector(".dialogCancel");
    const dialogBtn = document.querySelector(".dialogBtn");
    const dialogInp = document.querySelector("#dialogInp");

    dialogBox.setAttribute("open","");
    document.querySelector(".dialogBG").classList.toggle("activeSection");

    if(fromWhich === "alert"){
        dialogText.textContent = text;
        dialogBox.classList.add("alertBox");
        dialogCancel.textContent = "Confirm";
        dialogCancel.addEventListener("click", promptExit);
    }else if(fromWhich === "confirm"){
        dialogText.textContent = text;
        dialogBox.classList.add("confirmBox");
        dialogBtn.removeAttribute("hidden");
        dialogBtn.textContent = "Confirm";
        dialogBtn.disabled = false;
        if(defaultConfirm){
            dialogBtn.addEventListener("click", confirmDialog);
            dialogCancel.addEventListener("click", confirmDialog);
        }else{
            dialogBtn.addEventListener("click", promptExit);
            dialogCancel.disabled = true;
            dialogCancel.setAttribute("hidden","");
        }
        // [dialogBtn, dialogCancel].forEach(item => item.addEventListener("click", confirmDialog));
    }else if(fromWhich === "inputPrompt"){
        dialogText.textContent = text;
        dialogBtn.removeAttribute("hidden");
        dialogBtn.textContent = "Confirm";
        dialogInp.classList.toggle("confirmActive");
        !dialogBtn.disabled ? dialogBtn.disabled = true: "";
        [dialogBtn, dialogCancel].forEach(item => item.addEventListener("click", confirmDialog));
    }
}

const promptExit = () => {
    promptInp = null;
    promptBtnInp = null;
    const dialogBtn = document.querySelector(".dialogBtn");
    const dialogInp = document.querySelector("#dialogInp");
    const dialogCancel = document.querySelector(".dialogCancel");
    const dialogBox = document.querySelector("#dialogBox");

    document.querySelector(".dialogBG").classList.toggle("activeSection");
    if(!dialogBtn.attributes.hidden){
        dialogBtn.setAttribute("hidden","");
        dialogBtn.textContent = "";
    }

    if(dialogInp.classList.contains("confirmActive")){
        dialogInp.value = "";
        dialogInp.classList.toggle("confirmActive");
    }


    dialogCancel.textContent !== "Cancel" ? dialogCancel.textContent = "Cancel" : "";

    if(dialogBox.classList.contains("alertBox")){
        dialogCancel.removeEventListener("click",promptExit);
        dialogBox.classList.toggle("alertBox");
    }else if(dialogBox.classList.contains("confirmBox")){
        if(dialogCancel.disabled){
            dialogCancel.disabled = false;
            dialogCancel.removeAttribute("hidden");
            dialogBtn.removeEventListener("click", promptExit);
        }else{
            dialogBtn.removeEventListener("click", confirmDialog);
            dialogCancel.removeEventListener("click", confirmDialog);
        }
        dialogBox.classList.toggle("confirmBox");
    }

    !dialogBtn.disabled ? dialogBtn.disabled = true: "";
    document.querySelector(".dialogText").textContent = "";
    dialogBox.removeAttribute("open");
}


const confirmDialog = e => {
    if(e.target.classList.contains("dialogBtn")){
        promptBtnInp = "y";
    }else{
        promptBtnInp = "n";
    }
}

// background panel handler
const backgroundPanelHandler = (nodeClass, fromMenu = true) => {
    const bgPanel = document.querySelector(".backGroundPanel");

    if(nodeClass!==".userSidePanel"){
        fromMenu ? bgPanel.classList.toggle("activeSection") : (bgPanel.classList.contains("activeSection") ? bgPanel.classList.toggle("activeSection") : "");
        
        bgPanel.classList.toggle("hiddenSection");
    }
}

const closeBtnClicked = (nodeClass, userEdit, initialize=false) => {
    if(nodeClass === ".loginRegisterMenu"){
        if(document.querySelector(nodeClass).classList.contains("registerRN") || initialize){
            document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
            document.querySelector("section .emailContainer input").disabled = true;
            initialize ? "" : document.querySelector(nodeClass).classList.toggle("registerRN");
        }
        document.querySelector(".loginRegisterMenu > p > .loginregisterFuncBtn").disabled = true;
        document.querySelectorAll(".loginRegisterMenu p input").forEach(inp=>inp.disabled = true);
    }else if(nodeClass === ".noteMenu"){
        const selectOrder = document.querySelector(".mainArticle .orderListCon select");

        if(userEdit){
            const addBtn = document.querySelector(".editBtn");
            addBtn.classList.toggle("editBtn");
            addBtn.classList.toggle("addBtn");
            addBtn.textContent = "Add Note";
            document.querySelector(".noteMenu").classList.toggle("userEdit");
            const lbl = document.querySelector(".noteMenu > div.extraInput > .saveLocallyContainer > label")
            if(lbl.classList.contains('edit_created')){
                lbl.classList.toggle('edit_created')
            }
        }else{
            const saveLocallyCon = document.querySelector(".extraInput .saveLocallyContainer");

            if(!saveLocallyCon.childNodes[3].disabled){
                saveLocallyCon.childNodes[3].disabled = true;
                saveLocallyCon.childNodes[3].checked = false;
                saveLocalChk = false;
            }
        }

        chkInputNoteDefault(document.querySelector(".extraInput.fd > .fd > .addBtn"));

        if(document.querySelector(".lockBtn > img").classList.contains("locked")){
            document.querySelector(".lockBtn > img").classList.remove("locked");
        }

        if(!initialize){
            let whichOrder = selectOrder[selectOrder.selectedIndex].value;

            if(currentOpenID && !isSavedAlready){
                saveEditableAndLocked(editable, prevEditable, isLocked, prevLocked, isLockedPass).then(()=>{
                    isSavedAlready = false;
                    noteMenuLockReset();
                    orderList(whichOrder)
                })
            }else{
                isSavedAlready = false;
                noteMenuLockReset();
                orderList(whichOrder)
            }
        }
        activeNote();
    }else if(nodeClass===".userSettings"){
        const sidePanelControl = document.querySelector(`${nodeClass} .sidePanelControl`);

        if(document.querySelector(nodeClass).classList.contains("asideOpen")){
            menuClicked(".userSidePanel");
        }

        userNickName = _userNickName = userMobile = _userMobile = null;

        [sidePanelControl.childNodes[1], sidePanelControl.childNodes[3], sidePanelControl.childNodes[5]].forEach((item, i)=>{
            if(i!==2){
                item.classList.remove("userSidePanelBtn");
                item.childNodes[1].removeEventListener("click",clicked);
                item.childNodes[1].disabled=true;
                item.childNodes[1].textContent = "Add";
            }else{
                item.childNodes[1].textContent = "Nada";
            }
        })

        saveProfileBtnChk(true);
    }

    clearInputs(nodeClass);

    if(initialize){
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
    }else{
        document.querySelector(nodeClass).classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("activeSection");
    }

    backgroundPanelHandler(nodeClass, false);
}

const loginRegisterMenuPanelHandler = (nodeClass, registerClass)=>{
    if(registerClass==="registerBtn"){
        document.querySelector("section p button").textContent = "Register";
        document.querySelector("section .emailContainer input").disabled = false;
        document.querySelector("section .emailContainer").classList.toggle("hiddenSection");
        document.querySelector(nodeClass).classList.toggle("registerRN");
    }else{
        document.querySelector("section p button").textContent = "Log in";
    }
    document.querySelectorAll(`${nodeClass} p  input`).forEach(inp=>{
        if(inp.parentNode.classList[0]!==".emailContainer"){
            inp.disabled=false;
        }
    })

    menuToggle(nodeClass);
}

const noteMenuPanelHandler = nodeClass => {
    const delBtn = document.querySelector(".delBtn");
    const locallySaveCheck = document.querySelector(".extraInput .saveLocallyContainer");
    const addBtn = document.querySelector(".addBtn");

    if(!currentOpenID){
        delBtn.classList.add("hiddenSection");
        delBtn.disabled = true;
        activeNote(true);
        if(currentUser){
            if(locallySaveCheck.classList.contains("hiddenSection")){
                locallySaveCheck.classList.remove("hiddenSection");
            }
            if(locallySaveCheck.childNodes[3].classList.contains("hiddenSection")){
                locallySaveCheck.childNodes[1].innerText = "Save Locally: ";
                locallySaveCheck.childNodes[3].classList.remove("hiddenSection");
            }
            
            locallySaveCheck.childNodes[3].disabled ? locallySaveCheck.childNodes[3].disabled = false : "";
        }else{
            if(!locallySaveCheck.classList.contains("hiddenSection")){
                locallySaveCheck.classList.add("hiddenSection");
                locallySaveCheck.childNodes[3].disabled ? "" : locallySaveCheck.childNodes[3].disabled = true;
            }
        }
        menuToggle(nodeClass);
    }else{
        new Promise((resolve) => {
            let whichKind = idStringCut(currentOpenID);
            let id = Number(currentOpenID.replace(whichKind, ""));

            noteList.forEach(note => {
                if(whichKind === "note" && note.username !== "localUser"){
                    if(currentUser.username === note.username){
                        if(id === note.id){
                            resolve(note);
                        }
                    }
                }else if(whichKind === "localNote" && note.username === "localUser"){
                    if(id === note.id){
                        resolve(note);
                    }
                }
            })
        }).then(noteData => {
            noteMenuUnlock(noteData).then(()=>{
                noteMenuLoadProfile(noteData, nodeClass, locallySaveCheck, delBtn, addBtn);
            }).catch(err => {
                err ? promptHandler("alert", err) : "";
            })
        })
        
    }
}

const noteMenuUnlock = data => {
    return new Promise((resolve, reject) => {
        if(data.locked){
            // let notePass = window.prompt("Enter note password here: ");
            promptHandler("inputPrompt", "Enter note password here: ");

            let promptInterval = setInterval(() => {
                if(promptBtnInp){

                    clearInterval(promptInterval);

                    if(promptBtnInp === "n"){
                        reject(null);
                    }else{
                        if(!promptInp){
                            reject("Empty password!");
                        }
                        if(promptInp === data.locked_password){
                            resolve();
                        }else{
                            reject("Wrong password!")
                        }
                    }
                    promptExit();
                }
            }, 100);
        }else{
            resolve();
        }
    })
}

const noteMenuLockReset = () => {
    if(isLocked){
        isLocked = false;
        isLockedPass = null;
    }
}

const noteMenuLoadProfile = (data, nodeClass, locallySaveCheck, delBtn, addBtn) => {
    if(locallySaveCheck.classList.contains("hiddenSection")){
        locallySaveCheck.classList.remove("hiddenSection");
    }

    if(!locallySaveCheck.childNodes[3].classList.contains("hiddenSection")){
        locallySaveCheck.childNodes[3].classList.add("hiddenSection");
        locallySaveCheck.childNodes[3].disabled ? "" : locallySaveCheck.childNodes[3].disabled = true;
    }

    addBtn.classList.toggle("addBtn");
    addBtn.classList.toggle("editBtn");
    addBtn.textContent = "Edit";

    let title = titleInput = data.title;
    let body = bodyInput = data.body;

    prevEditable = editable = data.editable;
    prevLocked = isLocked = data.locked;
    isLockedPass = data.locked_password;

    let date = `created: ${data.date_created.month+1}/${data.date_created.day}/${data.date_created.year}`;
    if(data.last_updated){
        date+=` edited: ${data.last_updated.month+1}/${data.last_updated.day}/${data.last_updated.year}`;
        locallySaveCheck.childNodes[1].classList.toggle('edit_created');
    }

    locallySaveCheck.childNodes[1].innerText = date;
    document.querySelector(`${nodeClass} input`).value = prevTitleInput = title;
    prevBodyInput = body;

    Quill.find(document.querySelector(`${nodeClass} .bodyBox`)).setContents(JSON.parse(prevBodyInput));

    if(editable){
        document.querySelector(`${nodeClass} .extraInput .checkEditContainer input`).checked = true;
    }else{
        document.querySelector(`${nodeClass} .extraInput .checkEditContainer input`).checked = false;
    }

    if(isLocked){
        document.querySelector(`${nodeClass} .lockBtn > img`).classList.toggle("locked");
    }

    editActiveNote();

    delBtn.disabled=false;
    delBtn.classList.remove("hiddenSection");
    document.querySelector(nodeClass).classList.toggle("userEdit");

    menuToggle(nodeClass);
}

const userSettingsPanelHandler = nodeClass => {
    const sidePanelControl = document.querySelector(".sidePanelControl");

    if(currentUser.pfp_data.pfp === "default"){
        pfpChange(_DEFAULTPFP);
        pfpEditCheck(false);
    }else{
        pfpChange(currentUser.pfp_data.pfp);
        pfpEditCheck(true);
    }

    [sidePanelControl.childNodes[1], sidePanelControl.childNodes[3], sidePanelControl.childNodes[5]].forEach((item,i)=>{
        if(i!==2){
            item.classList.add("userSidePanelBtn");
            item.childNodes[1].addEventListener("click",clicked);
            item.childNodes[1].disabled=false;
            i === 0 ? 
            (currentUser.nick_data.nickname ? item.childNodes[1].textContent = userNickName = _userNickName = currentUser.nick_data.nickname : "") : 
            (currentUser.mobile ? item.childNodes[1].textContent = userMobile = _userMobile = currentUser.mobile : "" );
        }else{
            item.childNodes[1].textContent = currentUser.email;
        }
        
    })
    menuToggle(nodeClass);
}

const sidePanelHandler = (nodeClass, targetClass = null) => {
    let returnVar = true;
    const sidePanelControl = document.querySelector(".userSettings > .sidePanelControl");
    const userSideInsertBox = document.querySelector(".userSidePanel > p:nth-child(1)");
    const userSidePanelBtn = document.querySelector(".userSidePanel > .fd > .sidePanelBtn");
    const userSettings = document.querySelector("section.userSettings");

    if(!targetClass){
        targetClass = userSideInsertBox.childNodes[3].attributes.data_open.value + "Btn";
    }

    if(userSettings.classList.contains("asideOpen") && !userSideInsertBox.parentNode.classList.contains("hiddenSection") && targetClass.replace("Btn","")===userSideInsertBox.childNodes[3].attributes.data_open.value){
        sidePanelInputReset(userSideInsertBox, sidePanelControl, userSidePanelBtn);
    }else{
        returnVar = sidePanelInputReset(userSideInsertBox, sidePanelControl);
        const sidePanelInp = document.querySelector(".userSidePanel > p > #sidePanelInp");

        if(targetClass==="nickNameBtn"){
            userSideInsertBox.childNodes[1].innerText = "New Nickname:";
            userSideInsertBox.childNodes[3].setAttribute("data_open", "nickName");
            sidePanelControl.childNodes[1].childNodes[1].textContent = "Cancel";
            userNickName ? userSideInsertBox.childNodes[3].value = sideInput = userNickName : "";
        }else{
            userSideInsertBox.childNodes[1].innerText = "Mobile Number:";
            userSideInsertBox.childNodes[3].setAttribute("data_open", "mobile");
            sidePanelControl.childNodes[3].childNodes[1].textContent = "Cancel";
            userMobile ? userSideInsertBox.childNodes[3].value = sideInput = userMobile : "";
        }

        sideInput ? userSidePanelBtn.textContent = "Edit" : (returnVar ? "" : userSidePanelBtn.textContent = "Add");
        
        setTimeout(() => {
            sidePanelInp.disabled = false;
            sidePanelInp.focus();
        }, 60);
    }

    if(returnVar){
        document.querySelector("section.userSettings").classList.toggle("asideOpen");
    }

    menuToggle(nodeClass,returnVar);
}

const sidePanelInputReset = (userSideNode, sidePanelNode, userSidePanelBtn=false) => {
    let returnVar = true;
    const sidePanelInp = document.querySelector(".userSidePanel > p > #sidePanelInp");
    const sidePanelBtn = document.querySelector(".userSidePanel > p > .sidePanelBtn");

    if(userSideNode.childNodes[3].attributes.data_open){
        if(userSideNode.childNodes[3].attributes.data_open.value === "nickName"){
            userNickName ? sidePanelNode.childNodes[1].childNodes[1].textContent = userNickName : sidePanelNode.childNodes[1].childNodes[1].textContent = "Add";
        }else{
            userMobile ? sidePanelNode.childNodes[3].childNodes[1].textContent = userMobile : sidePanelNode.childNodes[3].childNodes[1].textContent = "Add";
        }

        if(userSidePanelBtn){
            userSidePanelBtn.textContent === "Add" ? "" : userSidePanelBtn.textContent = "Add";
            userSideNode.childNodes[1].innerText = "Insert Value:";
            userSideNode.childNodes[3].removeAttribute("data_open");
        }else{
            //returnVar becomes false if sidePanel is already open
            returnVar = userSidePanelBtn;
        }

        if(userSideNode.childNodes[3].value !== ""){
            userSideNode.childNodes[3].value = "";
            sideInput = "";
        }
        
        setTimeout(() => {
            sidePanelInp.blur();
            sidePanelInp.disabled = sidePanelBtn.disabled = true;
        }, 60);
    }
    return returnVar;
}

const clearInputs = whichNode => {
    // affected by textarea
    if(whichNode===".loginRegisterMenu"){
        document.querySelectorAll(`${whichNode} p input`).forEach(input=>input.value = "");
    }else if(whichNode===".userSettings"){
        pfpRemove(null);
    }else{
        document.querySelector(`${whichNode} input`).value="";
        if(Quill.find(document.querySelector(`${whichNode} .bodyBox`))){
            Quill.find(document.querySelector(`${whichNode} .bodyBox`)).setText("");
        }
        // document.querySelector(`${whichNode} textarea`).value="";
        document.querySelector(`${whichNode} .extraInput .checkEditContainer input`).checked = false;
        titleInput = "";
        bodyInput = "";
        isLocked = editable = prevEditable = prevLocked = false;
        if(document.querySelector(`${whichNode} > .lockBtn > img`).classList.contains("locked")){
            isLocked = false;
            document.querySelector(`${whichNode} > .lockBtn > img.locked`).classList.remove("locked");
        }
    }
}

const activeNote = (isActive = false, fromEdit = false) => {
    // affected by textarea
    const bodyBox = document.querySelector(".noteMenu .bodyBox");

    document.querySelector(".noteMenu input").disabled = !isActive;

    if(Quill.find(bodyBox)){
        Quill.find(bodyBox).enable(isActive);
        if(isActive){
            bodyBox.classList.contains("ql-disabled") ? bodyBox.classList.toggle("ql-disabled") : "";
        }else{
            !bodyBox.classList.contains("ql-disabled") ? bodyBox.classList.toggle("ql-disabled") : "";
        }
    }

    if(!fromEdit){
        if(document.querySelector(".noteMenu").classList.contains("nonEditable")){
            document.querySelector(".noteMenu").classList.toggle("nonEditable");
        }
    }
}

const editActiveNote = () => {
    const noteMenu = document.querySelector(".noteMenu");

    if(editable && noteMenu.classList.contains("nonEditable")){
        noteMenu.classList.toggle("nonEditable");
    }else if(!editable && !noteMenu.classList.contains("nonEditable")){
        noteMenu.classList.toggle("nonEditable");
    }
    activeNote(editable, true);
}

const activePanel = () => {
    const navNode = document.querySelector("nav .userPanel");

    // document.querySelector("section.userSettings").classList.contains("hiddenSection") ? "" : closeBtnClicked(".userSettings");
    checkingOpenedFrames();

    if(navNode.classList.contains("panelActive")){
        navNode.classList.toggle("panelActive");
        navNode.classList.toggle("panelInactive");
        userPanelBtn(true, [navNode.childNodes[1].childNodes[0], navNode.childNodes[3].childNodes[0]]);
        document.querySelector('.loginRegisterMenuBtn:nth-child(2) > button').classList.toggle('panelIsOpen');
        
    }else{
        if(navNode.classList.contains("panelInactive")){
            navNode.classList.toggle("panelActive");
            setTimeout(()=>{
                userPanelBtn(false, [navNode.childNodes[1].childNodes[0], navNode.childNodes[3].childNodes[0]]);
                document.querySelector('.loginRegisterMenuBtn:nth-child(2) > button').classList.toggle('panelIsOpen');
            }, 200)
        }else{
            userPanelBtn(true, [navNode.childNodes[1].childNodes[0], navNode.childNodes[3].childNodes[0]]);
        }
        

        navNode.classList.toggle("panelInactive");
    }
    
}

const userPanelBtn = (varBool, [btn1, btn2]) => {
    btn1.disabled = varBool;
    btn2.disabled = varBool;
}

const checkLoggedAccount = () => {
    if(localStorage.getItem(_USERLOGGEDKEY)){
        let localUserID = localStorage.getItem(_USERLOGGEDKEY);
        logInUserValidate(localUserID).then(userResp => {
            currentUser = userResp;
            accountLogged(true);
            userLogInOut(true);
        }).catch(() => {
            localStorage.removeItem(_USERLOGGEDKEY)
            accountLogged(false);
            nodeLoad().then(() => console.log("notes loaded"));
        })
    }else{
        nodeLoad().then(() => console.log("notes loaded"));
    }
}

const accountLogged = isLogged => {
    isLogged ? localStorage.setItem(_USERLOGGEDKEY, currentUser.userid) : localStorage.removeItem(_USERLOGGEDKEY);
}

const saveProfile = () => {
    //checks if currentFile was changed
    //currentFile by default is null
    //currentFile having a value other than null means it was changed
    let user = {userid: currentUser.userid};
    // if(currentFile){
    //     // updateUserDBASE(currentUser,'pfp',currentFile);
    //     user['pfp'] = currentFile;
    // }

    changedSettingsChk[_CHANGESETPROP[0]] ? user['pfp'] = currentFile : "";
    changedSettingsChk[_CHANGESETPROP[1]] ? user['nickname'] = userNickName : "";
    changedSettingsChk[_CHANGESETPROP[2]] ? user['mobile'] = userMobile : "";

    // updateUserDBASE(currentUser,'nickname',userNickName);
    // updateUserDBASE(currentUser,'mobile',userMobile);

    if('pfp' in user || 'nickname' in user || 'mobile' in user){
        fetch('http://127.0.0.1:5000/user/user-save', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(resp => {
            if(resp.ok){
                if(changedSettingsChk[_CHANGESETPROP[0]]){
                    currentUser.pfp_data.pfp_last = dateNowGet();
                    if(currentFile){
                        currentFile === "default" ? pfpNavChange(_DEFAULTPFP) : pfpNavChange(currentFile);
                    }
                }
                if(changedSettingsChk[_CHANGESETPROP[1]]){
                    currentUser.nick_data.nick_last = dateNowGet();
                    if(userNickName){
                        panelBtnChange(userNickName);
                    }else{
                        panelBtnChange(currentUser.username);
                    }
                }
                closeBtnClicked(".userSettings");
            }else{
                throw resp;
            }
        })
        .catch(errData=>errData.json().then(({errorMessage})=>promptHandler('alert',errorMessage)))
        .finally(()=>{
            _CHANGESETPROP.forEach(item => changedSettingsChk[item] ? changedSettingsChk[item] = false : "");
            currentFile=null;
        })
    }else{
        currentFile=null;
        closeBtnClicked(".userSettings");
    }

}

const saveProfileBtnChk = (chkDisable, currentChange=null) =>{
    const saveProfileBtn = document.querySelector(".userSettings > .saveProfileBtnCon > .saveProfileBtn");
    let chkToDisable=true;

    if(saveProfileBtn.disabled !== chkDisable){
        if(currentChange){
            _CHANGESETPROP.forEach(item=>{
                if(item!==currentChange){
                    if(changedSettingsChk[item]===true){
                        if(chkDisable){
                            chkToDisable=false;
                        }
                    }
                }else{
                    changedSettingsChk[item] = !chkDisable;
                }
                })
        }
        if(chkToDisable){
            saveProfileBtn.disabled = chkDisable;
        }
    }
}

const userMobileNickHandler = () => {
    const sidePanelControl = document.querySelector("aside.userSidePanel > p:nth-child(1)");
    let chkChange=true, btnChk;

    const open_DATA = sidePanelControl.childNodes[3].attributes.data_open.value;
    let valueReturn, whichChange;
    let strErr;

    if(open_DATA === 'nickName'){
        userNickName = sideInput;
        if(userNickName.length > 15){
            strErr = "Nickname should be 15 characters at a maximum"
        }else{
            if(userNickName.length < 5){
                valueReturn = userNickName;
            }else{
                strErr = "Nickname should be 4 characters at a minimum"
            }
        }
        
    }else{
        userMobile = sideInput;
        if(userMobile > 13){
            valueReturn = null
            chkChange = false;
            strErr = "Mobile number should be 13 characters at a maximum"
        }else{
            if(userMobile.length < 12){
                if(mobileNumberCheck(userMobile)){
                    valueReturn = userMobile;
                }else{
                    strErr = "Please provide a proper mobile number"
                }
            }else{
                strErr = "Mobile number should be 11 characters at a minimum"
            }
        }
    }

    if(strErr){
        valueReturn = null;
        chkChange = false;
    }

    if(chkChange){
        open_DATA === "nickName" ? valueReturn = userNickName : valueReturn = userMobile;

        if(sideInput){
            if((open_DATA === "nickName" && sideInput !== _userNickName) ||
            (open_DATA === "mobile" && sideInput !== _userMobile)){
                valueReturn = sideInput;
                btnChk = false;
            }else{
                if(open_DATA === "nickName" && userNickName !== _userNickName){
                    valueReturn = _userNickName;
                }else if(open_DATA === "mobile" && userMobile !== _userMobile){
                    valueReturn = _userMobile;
                }
                btnChk = true;
            }
        }else{
            if((open_DATA === "nickName" && userNickName) || (open_DATA === "mobile" && userMobile)){
                let returnVar = false;
                valueReturn = null;

                if(open_DATA === "nickName"){
                    !_userNickName && userNickName ? returnVar = true : "";
                }else{
                    !_userMobile && userMobile ? returnVar = true : "";
                }
            
                btnChk = returnVar;
            }else{
                // alert("empty");
                promptHandler("alert","Please provide a value")
                chkChange=false;
            }
        }
    }else{
        promptHandler("alert", strErr)
    }

    open_DATA === "nickName" ? userNickName = valueReturn : userMobile = valueReturn;
    open_DATA === "nickName" ? whichChange = "userNickChk" : whichChange = "userMobileChk"

    chkChange ? saveProfileBtnChk(btnChk, whichChange) : "";
    menuClicked(".userSidePanel");
}

const mobileNumberCheck = mobileVar => {
    let returnVar = false;

    if(!mobileVar.isNaN){
        if(!mobileVar.includes('e')){
            let firstTwoChar = mobileVar.slice(0,2);
            let firstThreeChar = mobileVar.slice(0,3);
            if(firstTwoChar === '09' || firstThreeChar === '639'){
                returnVar = true;
            }
        }
    }

    return returnVar;
}

const pfpUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = e => {
        if(e.target.result){
            let fileStr = e.target.result.split(",");
            if(fileStr[0].includes("data:image/")){
                if(!fileStr[0].includes("gif")){
                    pfpChange(e.target.result);
                    pfpEditCheck(true);
                    currentFile=e.target.result;
                }else{
                    // alert("Gif file prohibited");
                    promptHandler("alert","GIF file prohibited");
                }
            }else{
                // alert("not an image");
                promptHandler("alert", "Not an image");
            }
        }
    }

    reader.onerror = e => {
        // alert(e.target.error);
        promptHandler("alert",e.target.error)
    }

    reader.readAsDataURL(file);
}

const pfpRemove = e => {
    // e ?  ans = confirm("are you sure?") : true;

    e ? (promptHandler("confirm","Are you sure?")) : "";

    if(document.querySelector("#dialogBox").classList.contains("confirmBox")){
        let promptInterval = setInterval(()=>{
            if(promptBtnInp){
                clearInterval(promptInterval);
                if(promptBtnInp === 'y'){
                    pfpChange(_DEFAULTPFP);
                    pfpEditCheck(false);
                    currentFile="default";
                }
                promptExit();
            }
        },100)
    }
}

const pfpEditCheck = userPfpEditable => {
    const pfpCon = document.querySelector(".userSettings p .pfpContainer");
    if(userPfpEditable){
        if(!pfpCon.classList.contains("pfpClickable")){
            pfpCon.classList.add("pfpClickable");
            pfpCon.addEventListener("click", pfpRemove);
        }
    }else{
        pfpCon.classList.remove("pfpClickable");
        pfpCon.removeEventListener("click",pfpRemove);
    }
}

const pfpChange = newPfP => {
    document.querySelector(".userSettings .pfpContainer .pfp").src=newPfP;
    let chkToDisable;
    if(currentUser.pfp_data.pfp !== newPfP){
        if(currentUser.pfp_data.pfp === "default" && newPfP ===_DEFAULTPFP){
            chkToDisable = true;
        }else{
            chkToDisable = false;
        }
    }else{
        chkToDisable = true;
    }

    
    saveProfileBtnChk(chkToDisable, 'userPfpChk');
}

const pfpNavChange = newPfP => {
    document.querySelector(".loggedInUL .pfpContainer .pfp").src=newPfP;
}

const panelBtnChange = user => {
    document.querySelector(".loginRegisterMenuBtn:nth-child(2) > button").textContent = user;
}

const searchUserDBASE = (propName, propValue, opPropName=null, sndOpPropName=null) => {
    let returnVar=false;

    user_DATABASE.forEach(user=>{
        if(propValue===user[propName]){
            returnVar={[propName]:user[propName]};
            if(opPropName){
                returnVar[opPropName]=user[opPropName];
            }
            if(sndOpPropName){
                returnVar[sndOpPropName]=user[sndOpPropName];
            }
        }
    });

    return returnVar;
}

const updateUserDBASE = (username, propName, propValue) => {
    let returnVar = false;
    user_DATABASE.forEach(user=>{
        if(username===user.username){
            returnVar = true;
            user[propName] = propValue;
        }
    })

    let changeProperty = null;

    if(propName==="pfp"){
        changeProperty = "pfp_last";
    }else if(propName==="nickname"){
        changeProperty = "nick_last";
    }

    userProfileChange_DATABASE.forEach(item=>{
        if(item.username === username){
            item[changeProperty] = dateNowGet();
        }
    })
    

    return returnVar;
}

const chkLogInInput = (value, value2, value3 = null, whichNodeFlow = null) => {
    const loginregisterFuncBtn = document.querySelector(".loginRegisterMenu p .loginregisterFuncBtn");

    if(whichNodeFlow){
        value && value2 && value3 ? loginregisterFuncBtn.disabled = false : loginregisterFuncBtn.disabled = true;
    }else{
        value && value2 ? loginregisterFuncBtn.disabled = false : loginregisterFuncBtn.disabled = true;
    }
}

const chkInputNoteDefault = (addBtn, fValue=null, sValue=null) => {
    if(fValue || sValue){
            addBtn.disabled = false;
    }else{
            addBtn.disabled = true;
    }
}

const chkInputNoteUser = (val, whereFrom) => {
    let s_val;
    const editBtn = document.querySelector(".extraInput > .fd > .editBtn");
    whereFrom === "title" ? s_val = bodyInput : s_val = titleInput;

    if((whereFrom === "title" && (val !== prevTitleInput || s_val !== prevBodyInput)) || (whereFrom === "body" && (val !== prevBodyInput || s_val !== prevTitleInput))){
        editBtn.disabled = false;
    }else{
        editBtn.disabled = true;
    }
}

const checkIndexedDB = () => {
    let returnVar = 'indexedDB' in window;

    return returnVar;
}

const indexedDBInit = dbase => {
    switch (dbase.version) {
        case 1:
            !dbase.objectStoreNames.contains(_INDEXEDSTORENAME[0]) ? dbase.createObjectStore(_INDEXEDSTORENAME[0], {keyPath: 'id', autoIncrement: true}) : "";
            !dbase.objectStoreNames.contains(_INDEXEDSTORENAME[1]) ? dbase.createObjectStore(_INDEXEDSTORENAME[1], {keyPath: 'userid'}) : "";
    }
}

const indexedDBGetDB = () => {
    return new Promise((resolve, reject) => {
        if(checkIndexedDB()){
            let dbReq = indexedDB.open(_INDEXEDDBNAME, 1);

            dbReq.onupgradeneeded = e => {
                indexedDBInit(e.target.result);
            }
    
            dbReq.onsuccess = e => {
                console.log("database opened successfully");
                let dbase = e.target.result;
                resolve(dbase);
            }
    
            dbReq.onerror = e => {
                console.log("database error opening", e.target.result);
                reject(null);
            }
        }else{
            console.error('indexedDB Not supported!');
            reject(false);
        }
})}

const indexedDBTerminal = (oSName, item, transactionType) => {
    return new Promise((resolve, reject) => {
        indexedDBGetDB().then(dbase => {
            if(dbase){
                let tx = dbase.transaction(oSName, 'readwrite');
                let store = tx.objectStore(oSName);
    
                tx.oncomplete = () => {
                    if(oSName===_INDEXEDSTORENAME[0]){
                        indexedDBGetAllNoteOS().then(data=>{resolve(data.notes)})
                    }else{
                        resolve(true);
                    }
                    
                }
    
                tx.onerror = () => {
                    reject(false);
                }
    
                switch(transactionType) {
                    case 'add':
                        store.add(item);
                        break;
                    case 'edit':
                        store.put(item);
                        break;
                    case 'del':
                        store.delete(item);
                        break;
                }
            }else{
                reject(false);
            }
        }).catch(()=>{
            reject(false);
        });
    })
}

const indexedDBGetAllNoteOS = () => {
    return new Promise((resolve, reject) => {
        indexedDBGetDB().then(dbase=>{
            let x = 0;
            let req = dbase.transaction(_INDEXEDSTORENAME[0], 'readonly').objectStore(_INDEXEDSTORENAME[0]).openCursor();
            let indexedNote=[];

            req.onsuccess = e => {
                let cursor = e.target.result;
                if(cursor){
                    indexedNote.push(cursor.value);
                    x++;
                    cursor.continue();
                }else{
                    if(x){
                        resolve({notes: indexedNote});
                    }else{
                        resolve({notes: null});
                    }
                }
            }

            req.onerror = e => {
                reject(false);
            }
        }).catch(()=>{
            reject(false);
        });
    })
}

const indexedDBAlternateGetAll = oSName => {
    indexedDBGetDB().then(dbase => {
        let req = dbase.transaction(oSName, 'readonly').objectStore(oSName).getAll();

        req.onsuccess = e => {
            console.log(e.target.result, "ll");
        }
    }).catch(()=>{
        reject(false);
    });
}

const indexedDBGetData = (oSName, id) => {
    return new Promise((resolve, reject) => {
        indexedDBGetDB().then(dbase => {
            if(dbase){
                let req = dbase.transaction(oSName, "readonly").objectStore(oSName).get(id);

                req.onsuccess = data => {
                    if(data){
                        resolve(data);
                    }else{
                        resolve(null);
                    }
                }

                req.onerror = e => {
                    reject(null);
                }
            }
        }).catch(()=>{
            reject(false);
        });
    })
}

const indexedDBDel = () => {
    // delete database

    var request = indexedDB.deleteDatabase(_INDEXEDDBNAME);

    request.onsuccess = e => {console.log("there ya go")};
}

window.onload = () =>{
    const sections = document.querySelectorAll("body section");
    const selectOrder = document.querySelector(".mainArticle .orderListCon select");
    const sectionCloseBtns = document.querySelectorAll("section .closeBtn");
    const logOutBtn = document.querySelector(".userPanel li .logOutBtn");
    const dialogInp = document.querySelector("#dialogInp");
    const dialogBtn = document.querySelector(".dialogBtnCon > .dialogBtn");
    //loginRegister
    const loginRegisterMenu = document.querySelector(".loginRegisterMenu");
    const loginMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .loginBtn");
    const registerMenuBtn = document.querySelector("ul .loginRegisterMenuBtn .registerBtn");
    const loginregisterFuncBtn = document.querySelector(".loginRegisterMenu p .loginregisterFuncBtn");
    const usernameInput = document.querySelector("#usernameInput");
    const passwordInput = document.querySelector("#passwordInput");
    const emailInput = document.querySelector("#emailInput");
    //note
    const noteMenu = document.querySelector(".noteMenu");
    const addBtn = document.querySelector(".addBtn");
    const delBtn = document.querySelector(".delBtn");
    const titleBox = document.querySelector(".noteMenu input");
    const bodyBox = document.querySelector(".noteMenu > .bodyBox");
    const chckBox = document.querySelector(".noteMenu .extraInput .checkEditContainer input");
    const saveLocallyCheck = document.querySelector(".noteMenu .extraInput .saveLocallyContainer input");
    const lockedBtn = document.querySelector(".noteMenu > .lockBtn > img");
    //userSettings
    const userSettings = document.querySelector(".userSettings");
    const userSettingsBtn = document.querySelector(".userSettingsBtn");
    const userpfpInput = document.querySelector("#userpfpInput");
    const saveProfileBtn = document.querySelector(".saveProfileBtn");
    const sidePanelInp = document.querySelector("aside.userSidePanel > p:nth-Child(1) > #sidePanelInp");
    const sidePanelBtn = document.querySelector("aside.userSidePanel > p:nth-Child(2) > .sidePanelBtn");
    //otherVar
    let init = true;

    sections.forEach(section=>{
        closeBtnClicked("."+section.classList[0],false,init);   
    });
    
    activePanel();

    let textBoxArea = new Quill(bodyBox, {modules :{ toolbar: false}, placeholder: "Body", theme: 'snow'});

    const insertInput = e => {
        if(e.target.classList.contains("titleBox")){
            currentOpenID ? chkInputNoteUser(e.target.value, "title") : chkInputNoteDefault(addBtn, e.target.value, bodyInput);
            titleInput = e.target.value;
        }else if(e.target.id === "usernameInput" || e.target.id === "passwordInput"){
            e.target.id === "usernameInput" ? userName = e.target.value : userPass = e.target.value;

            document.querySelector(".loginRegisterMenu").classList.contains("registerRN") ? chkLogInInput(userName, userPass, userEmail, "register") : chkLogInInput(userName, userPass);
        }else if(e.target.id === "emailInput"){
            userEmail = e.target.value;
            chkLogInInput(userName, userPass, userEmail, "register");
        }else if(e.target.id === "sidePanelInp"){
            sideInput = e.target.value;
            let printValue;

            if((sidePanelInp.attributes.data_open.value === "nickName" && userNickName) || 
            (sidePanelInp.attributes.data_open.value === "mobile" && userMobile)){
                sideInput ? printValue = "Edit" : printValue = "Clear";
                if(sidePanelInp.attributes.data_open.value === "nickName"){
                    userNickName === sideInput ? sidePanelBtn.disabled = true : sidePanelBtn.disabled = false;
                }else{
                    userMobile === sideInput ? sidePanelBtn.disabled = true : sidePanelBtn.disabled = false;
                }
            }else{
                sideInput ? sidePanelBtn.disabled = false : sidePanelBtn.disabled = true;
            }

            printValue ? sidePanelBtn.textContent = printValue : "";
        }else if(e.target.id === "dialogInp"){
            promptInp = e.target.value;

            if(promptInp){
                dialogBtn.disabled = false;
            }else{
                dialogBtn.disabled = true;
            }
        }
    }
    
    const checkingBox = e => {
        editable = e.target.checked;
        if(e.target.parentNode.parentNode.parentNode.classList.contains("userEdit")){
            
            editActiveNote();

            if(currentOpenID){
                if(titleInput!==prevTitleInput){
                    document.querySelector(".noteMenu > input.titleBox").value = titleInput = prevTitleInput;
                }
                if(bodyInput!==prevBodyInput){
                    document.querySelector(".noteMenu > textarea.bodyBox").value = bodyInput = prevBodyInput;
                }
                document.querySelector(".extraInput > .fd > .editBtn").disabled = true;
            }
        }
    }

    const chkLocallySave = e => {
        saveLocalChk = e.target.checked;
    }

    const chkLocked = e => {
        if(titleInput || bodyInput){
            isLocked = !isLocked;
            lockedBtn.classList.toggle("locked");
    
            if(isLocked){
                // let pass = window.prompt("Enter password for this lock: ");
                // isLockedPass = pass;
                
                promptHandler("inputPrompt", "Enter 4 characters password for this lock! Don't put password from other site!");

                let promptInterval = setInterval(() => {
                    if(promptBtnInp){
                        // let err = null;

                        clearInterval(promptInterval);

                        if(promptBtnInp === "n"){
                            promptExit();
                            isLocked = !isLocked;
                            lockedBtn.classList.toggle("locked");
                        }else{
                            if(promptInp.length === 4){
                                isLockedPass = promptInp;
                                promptExit();
                            }else{
                                promptExit();
                                isLocked = !isLocked;
                                lockedBtn.classList.toggle("locked");
                                promptHandler('alert', 'Please enter 4 characters for the password');
                            }
                            // else{
                            //     isLocked = !isLocked;
                            //     err = "Empty password!";
                            // }
                        }

                        // if(!isLocked){
                        //     lockedBtn.classList.toggle("locked");
                        //     err ? promptHandler("alert", err) : "";
                        // }
                    }
                }, 100)
            }else{
                if(isLockedPass){
                    promptHandler("confirm", "Are you sure you want to remove the lock of this note?");

                    let promptInterval = setInterval(() => {
                        if(promptBtnInp){
                            clearInterval(promptInterval);
                            if(promptBtnInp === 'y'){
                                isLockedPass = null;
                            }else{
                                isLocked = true;
                                lockedBtn.classList.toggle("locked");
                            }
                            promptExit();
                        }
                    }, 100);
                    
                }
            }

            // if(isLocked && !isLockedPass){
            //     promptHandler("alert","Lock password is empty!");
            //     isLocked = false;
            //     lockedBtn.classList.toggle("locked");
            // }
        }else{
            promptHandler("alert","Please enter a title or a body first!");
        }
        
    }

    const focusedTT = e => {
        e.target.parentNode.classList.toggle("focusTT");
    }

    const itemScan = (nodeList, targetNode) => {
        let returnVar = false;
        nodeList.forEach(item=>{
            if(!returnVar){
                if(item !== targetNode){
                    if(item.childNodes){
                        returnVar = itemScan(item.childNodes, targetNode);
                    }
                }else{
                    returnVar = true;
            }}
        })
        
        return returnVar;
    }

    [...sectionCloseBtns, logOutBtn, userSettingsBtn, loginMenuBtn, registerMenuBtn, loginregisterFuncBtn, addBtn, delBtn, , sidePanelBtn, saveProfileBtn].forEach(item=>item.addEventListener("click",clicked));
    [usernameInput, emailInput, passwordInput, titleBox, sidePanelInp, dialogInp].forEach(item=>item.addEventListener("input",insertInput));

    lockedBtn.addEventListener("click", chkLocked);

    textBoxArea.on("text-change", (delta, old, from) => {
        if(from !== "api"){
            let val = textBoxArea.getContents();

            if(delta.ops[0].delete){
                val = null;
            }

            val = JSON.stringify(val);

            currentOpenID ? chkInputNoteUser(val, "body") : chkInputNoteDefault(addBtn, val, titleInput);
            bodyInput = val;
        }
    })

    window.addEventListener("keydown", e => {
        e.key !== "Enter" ? keyPress = e.key : "";

        if(e.key === "Enter" && !keyPress){
            if(document.querySelector(".dialogBG").classList.contains("activeSection")){
                promptExit();
            }else{
                if(e.target === usernameInput || e.target === emailInput || e.target === passwordInput){
                    loginregisterFuncBtn.click();
                }else if(e.target === sidePanelInp){
                    sidePanelBtn.click();
                }
            }
        }
    });

    window.addEventListener("keyup", e => e.key !== "Enter" ? keyPress = null : "");

    window.addEventListener("click",e => {
        if(!clickedChk){
            const bgPanel = document.querySelector(".backGroundPanel");
            let chkWhichClicked = true;
            
            [noteMenu, loginRegisterMenu, userSettings].forEach(node => {
                if(!node.classList.contains("hiddenSection")){
                    e.target === bgPanel ? chkWhichClicked = false : "";
                }
            })

            chkWhichClicked ? "" : checkingOpenedFrames();
        }
    })

    //loginregister
    usernameInput.addEventListener("focus",focusedTT);
    passwordInput.addEventListener("focus",focusedTT);
    usernameInput.addEventListener("blur",focusedTT);
    passwordInput.addEventListener("blur",focusedTT);
    //note
    chckBox.addEventListener("change", checkingBox);
    saveLocallyCheck.addEventListener("change", chkLocallySave);
    //userSettings
    userpfpInput.addEventListener("change", pfpUpload);

    selectOrder.selectedIndex = 0;

    selectOrder.addEventListener("click", e => {
        checkingOpenedFrames();
    })

    selectOrder.addEventListener("change",({target})=>{
        orderList(target.value);
    })

    indexedDBGetDB();

    checkLoggedAccount();
}