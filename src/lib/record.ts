function recordCanvas(canvas: HTMLCanvasElement, time: number) {
  console.log('recording started');

  const recordedChunks: any[] = [];

  return new Promise(function (res, rej) {
    var stream = canvas.captureStream(25 /*fps*/);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp9'
    });

    mediaRecorder.start(time);

    mediaRecorder.ondataavailable = function (event) {
      recordedChunks.push(event.data);
      // after stop `dataavilable` event run one more time
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    };

    mediaRecorder.onstop = function (event) {
      console.log('recording stopped');
      var blob = new Blob(recordedChunks, {
        type: 'video/webm',
        mimeType: 'video/webm;codecs:vp9'
      });
      var url = URL.createObjectURL(blob);
      console.log(url);
      res(url);
    };
  });
}

export default async function record(canvas: HTMLCanvasElement) {
  const recording = recordCanvas(canvas, 8000);

  const $video = document.createElement('video');
  document.body.appendChild($video);
  $video.setAttribute('class', 'render-video');
  recording.then((url) => $video.setAttribute('src', url));
  console.log('recording render');

  // download it
  const link$ = document.createElement('a');
  link$.setAttribute('download', 'recordingVideo');
  recording.then((url) => {
    link$.setAttribute('href', url);
    link$.click();
  });
}
