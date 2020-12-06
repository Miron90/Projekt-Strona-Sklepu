import React, { useState } from "react";
import PropTypes from "prop-types";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button } from "semantic-ui-react";

const Dictaphone = (e) => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [color, setColor] = useState("teal");
  function handleMicrophone() {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      window.alert("Use have to enable microphone");
    }
    if (color == "teal") {
      setColor("red");
      SpeechRecognition.startListening();
    } else if (color == "red") {
      setColor("teal");

      setTimeout(() => {
        SpeechRecognition.stopListening();
        console.log(transcript);
        e.parent.handleSearchChange(transcript);
        console.log(e.parent.state);
        resetTranscript();
      }, 2000);
    }
  }
  return (
    <Button
      icon="microphone"
      htmlFor="search"
      className="products-size-large products-microphone "
      color={color}
      onClick={handleMicrophone}
    ></Button>
  );
};

export default Dictaphone;
