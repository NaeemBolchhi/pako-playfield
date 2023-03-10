let inflated = document.querySelector("inflated>textarea"),
    deflated = document.querySelector("deflated>textarea"),
    infCopy = document.querySelector("inflated .copy"),
    defCopy = document.querySelector("deflated .copy"),
    infDown = document.querySelector("inflated .download"),
    defDown = document.querySelector("deflated .download");

inflated.value = "";
deflated.value = "";

inflated.addEventListener("input",function() {
    if (inflated.value === "") {deflated.value = "";return;}
    deflated.value = pako.deflate(inflated.value);
});

deflated.addEventListener("input",function() {
    if (deflated.value === "") {inflated.value = "";return;}
    let array = eval(`new Uint8Array([${deflated.value}]);`),
        infval = pako.inflate(array);
    inflated.value = new TextDecoder().decode(infval);
});

function download(content, fileName, contentType, who) {
    who.classList.add("success");
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    setTimeout(function() {
        who.classList.remove("success");
    }, 750);
}

function copy(content, who) {
    who.classList.remove("success","failure");
	content.select();
	navigator.clipboard.writeText(content.value).then(function() {
		who.classList.add("success");
	}, function() {
		who.classList.add("failure");
	});
    setTimeout(function() {
        who.classList.remove("success","failure");
    }, 750);
}

infCopy.addEventListener("click",function() {
    copy(inflated, infCopy);
});

defCopy.addEventListener("click",function() {
    copy(deflated, defCopy);
});

infDown.addEventListener("click",function() {
    download(inflated.value, "Decompressed.txt", "text/plain", infDown);
});

defDown.addEventListener("click",function() {
    download(deflated.value, "Compressed.txt", "text/plain", defDown);
});