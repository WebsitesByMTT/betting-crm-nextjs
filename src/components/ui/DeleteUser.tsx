"use client";
import { DeleteUserProps } from "@/utils/Types";
import { useEffect, useRef } from "react";

const DeleteUser: React.FC<DeleteUserProps> = ({ deleteToken }) => {
  const deleteTokensRef = useRef(deleteToken);

  useEffect(() => {
    deleteTokensRef.current = deleteToken;
  });

  useEffect(() => {
    deleteTokensRef.current();
  }, []);

  return null;
};

export default DeleteUser;