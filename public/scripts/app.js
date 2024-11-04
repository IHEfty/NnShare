var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
}

firebase.initializeApp(firebaseConfig)

var storage = firebase.storage()
var auth = firebase.auth()

var progressBarBg = document.getElementById('progress-bar-bg')
var progressBar = document.getElementById('progress')

document.getElementById('upfile').addEventListener('change', function(e) {
	var selectedFileName = e.target.files[0].name;
	document.getElementById('selectedFileName').textContent = selectedFileName;
})

function selectFile() {
	var fileInput = document.getElementById('upfile')
	fileInput.click()
}

var fileDropZone = document.getElementById('file-drop-zone')

fileDropZone.addEventListener('dragover', function(e) {
	e.preventDefault()
	fileDropZone.classList.add('dragover')
})

fileDropZone.addEventListener('dragleave', function() {
	fileDropZone.classList.remove('dragover')
})

fileDropZone.addEventListener('drop', function(e) {
	e.preventDefault()
	fileDropZone.classList.remove('dragover')
	var files = e.dataTransfer.files;
	if (files.length > 0) {
		var selectedFileName = files[0].name;
		document.getElementById('selectedFileName').textContent = selectedFileName;

		for (var i = 0; i < files.length; i++) {
			uploadFile(files[i])
		}
	}
})

document.getElementById('uploadButton').addEventListener('click', function() {
	var user = firebase.auth().currentUser;
	if (user) {
		uploadFile()
	} 
	else {
		alert('Please log in to upload files.')
		window.location.href = './join_us.html';
	}
})

document.getElementById('upfile').addEventListener('change', function(e) {
	var selectedFileName = e.target.files[0].name;
	document.getElementById('selectedFileName').textContent = selectedFileName;
	uploadFile() 
})

function uploadFile(file) {
    if (!file) {
        var fileInput = document.getElementById('upfile');
        file = fileInput.files[0];
    }

    if (file) {
        var storageRef = storage.ref('uploads/' + file.name);

        var uploadTask = storageRef.put(file);

        progressBarBg.style.display = 'block';

        uploadTask.on('state_changed',
            function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.style.width = progress + '%';
            },
            function(error) {
                console.error('Upload error:', error);
                alert('Upload failed. Please try again.');
                progressBarBg.style.display = 'none';
            },
            function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    var downloadLink = document.getElementById('downloadLink');
                    downloadLink.href = downloadURL;
                    downloadLink.textContent = downloadURL;
                    alert('File uploaded successfully: ' + downloadURL);
                    progressBarBg.style.display = 'none';
                    progressBar.style.width = '0%';
                });
            }
        );
    }
}
