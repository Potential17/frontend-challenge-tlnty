import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

type RecipientsDisplayProps = {
  recipients: string[];
};

const RecipientsDisplay = ({ recipients }: RecipientsDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState<string>("");

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const maxWidth = container.offsetWidth;

      let visibleText = "";
      let remainingCount = 0;

     
      const tempSpan = document.createElement("span");
      tempSpan.style.visibility = "hidden";
      tempSpan.style.position = "absolute";
      tempSpan.style.whiteSpace = "nowrap";
      document.body.appendChild(tempSpan);

      if (recipients.length > 0) {
        
        const firstRecipient = recipients[0];
        tempSpan.textContent = firstRecipient;
        const firstWidth = tempSpan.offsetWidth;

        if (firstWidth <= maxWidth) {
          visibleText = firstRecipient;
        } else {
         
          visibleText = `${firstRecipient.split("@")[0]}`;
        }
      }

     
      remainingCount = 0; 

      for (let i = 1; i < recipients.length; i++) {
        const recipient = recipients[i];
        tempSpan.textContent = `${visibleText}, ${recipient}`;
        const width = tempSpan.offsetWidth;

        if (width > maxWidth) {
         
          remainingCount = recipients.length - i;
          break;
        }

        visibleText += `, ${recipient}`;
      }

    
      if (remainingCount > 0) {
        visibleText += '...';
      }

      document.body.removeChild(tempSpan);

      setDisplayText(visibleText);
    }
  }, [recipients]);

  return (
    <Container ref={containerRef}>
     <Text>{displayText}</Text>
      {recipients.length > 1 && displayText.includes('...') && (
        <Badge>+{recipients.length - displayText.split(',').length + 1}</Badge>
      )}
    </Container>
  );
};

export default RecipientsDisplay;


const Container = styled.div` 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  overflow: hidden; 
  white-space: nowrap; 
  font-size: 16px; 
  color: #333333; 
  padding: 5px 10px; 
`; 
 
const Text = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 10px; 
`;

const Badge = styled.span` 
  background-color:rgb(153, 153, 153); 
  color: white; 
  border-radius: 12px; 
  padding: 2px 6px; 
  font-size: 12px; 
  line-height: 1; 
  vertical-align: middle; 
  flex-shrink: 0; 
`;