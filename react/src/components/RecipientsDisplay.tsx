import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

type RecipientsDisplayProps = {
  recipients: string[];
};

const RecipientsDisplay = ({ recipients }: RecipientsDisplayProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [displayText, setDisplayText] = useState<string>("");
  const [remainingCount, setRemainingCount] = useState<number>(0);

  useEffect(() => {
    const updateVisibleRecipients = () => {
      if (wrapperRef.current) {
        const container = wrapperRef.current;
        const maxWidth = container.offsetWidth;

        let visibleText = "";
        let currentWidth = 0;
        let lastIndex = -1;

        const fontStyle = window.getComputedStyle(container).font;
        const ellipsisWidth = calculateTextWidth("...", fontStyle);
        const badgeWidth = calculateTextWidth(`+${recipients.length}`, fontStyle) + 10;

        for (let i = 0; i < recipients.length; i++) {
          const recipientWidth = calculateTextWidth(recipients[i], fontStyle);
          const separatorWidth = i > 0 ? calculateTextWidth(", ", fontStyle) : 0;

          if (currentWidth + recipientWidth + separatorWidth + ellipsisWidth + badgeWidth > maxWidth) {
            break;
          }

          currentWidth += recipientWidth + separatorWidth;
          lastIndex = i;
        }

        visibleText = recipients.slice(0, lastIndex + 1).join(", ");
        setDisplayText(visibleText);
        setRemainingCount(recipients.length - lastIndex - 1);
      }
    };

    updateVisibleRecipients();
    window.addEventListener("resize", updateVisibleRecipients);

    return () => {
      window.removeEventListener("resize", updateVisibleRecipients);
    };
  }, [recipients]);

  return (
    <Container ref={wrapperRef}>
      <Text>
        {displayText}
        {remainingCount > 0 && "..."}
      </Text>
      {remainingCount > 0 && <Badge>+{remainingCount}</Badge>}
    </Container>
  );
};


const calculateTextWidth = (text: string, font: string) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font;
    return context.measureText(text).width;
  }
  return 0;
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
  font-size: inherit;
`;

const Badge = styled.span`
  flex-shrink: 0;
  margin-left: 5px;
  font-size: 16px;
  color: #f0f0f0;
  background-color: #666666;
  border-radius: 3px;
  padding: 2px 5px;
`;
