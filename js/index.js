var oBox = document.getElementById("boxs")
	var oLi = oBox.getElementsByTagName("li")
	var oDiv = oBox.getElementsByTagName("div")
	for(var i = 0; i < oLi.length; i++) {
		oLi[i].index = i
		oLi[i].onclick = function() {

			for(var j = 0; j < oLi.length; j++) {
				oLi[j].className = "";
				oDiv[j].className = "";
			}
			oLi[this.index].className = "select";
			oDiv[this.index].className = "select";
		}
	}