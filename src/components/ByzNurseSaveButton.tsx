import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
//import { Link } from "@mui/material";
//import ByzMuiTypography from "src/components/core-components/mui/inputs/ByzMuiTypography";
import CheckIcon from '@mui/icons-material/Check';
//import { useTranslate } from "src/locales";

interface ByzNurseSaveButtonProps extends React.ComponentProps<typeof Button> {
  onClick?: () => void;
  link?: string;
  popup?: boolean;
}

const StyledButton = styled(Button)<{ popup?: boolean }>(({ popup }) => ({
  border: "1px solid #2979C3",
  backgroundColor: "#63B4FF33",
  padding: "5px 10px",
  color: "#2979C3",
  "&:hover": {
    backgroundColor: "#2D9435",
    color: "#fff",
  },
}));

const ByzNurseSaveButton: React.FC<ByzNurseSaveButtonProps> = ({ onClick, link, popup }) => {
  //const { t } = useTranslate();
  const [hover, setHover] = useState(false);

  const buttonContent = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <CheckIcon
        style={{
          width: "16px",
          height: "16px",
          transition: "0.2s ease-in-out",
        }}
      />
      <Typography fontWeight={400} marginLeft="8px">
        save
      </Typography>
    </div>
  );

  return link ? (
    <Link to={link} style={{ textDecoration: "none" }}>
      <StyledButton
        popup={popup}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {buttonContent}
      </StyledButton>
    </Link>
  ) : (
    <StyledButton
      popup={popup}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {buttonContent}
    </StyledButton>
  );
};

export default ByzNurseSaveButton;
