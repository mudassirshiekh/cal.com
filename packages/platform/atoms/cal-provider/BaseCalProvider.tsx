import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useState } from "react";
import { useCallback } from "react";

import enTranslations from "@calcom/web/public/static/locales/en/common.json";

import { AtomsContext } from "../hooks/useAtomsContext";
import { useOAuthClient } from "../hooks/useOAuthClient";
import { useOAuthFlow } from "../hooks/useOAuthFlow";
import { useTimezone } from "../hooks/useTimezone";
import { useUpdateUserTimezone } from "../hooks/useUpdateUserTimezone";
import http from "../lib/http";
import { Toaster } from "../src/components/ui/toaster";
import type { CalProviderProps } from "./CalProvider";

type translationKeys = keyof typeof enTranslations;

export function BaseCalProvider({ clientId, accessToken, options, children }: CalProviderProps) {
  const [error, setError] = useState<string>("");

  const { mutateAsync } = useUpdateUserTimezone();

  const handleTimezoneChange = useCallback(
    async (currentTimezone: string) => {
      await mutateAsync({ timeZone: currentTimezone });
    },
    [mutateAsync]
  );

  useTimezone(handleTimezoneChange);

  const { isInit } = useOAuthClient({
    clientId,
    apiUrl: options.apiUrl,
    refreshUrl: options.refreshUrl,
    onError: setError,
    onSuccess: () => {
      setError("");
    },
  });

  const { isRefreshing, currentAccessToken } = useOAuthFlow({
    accessToken,
    refreshUrl: options.refreshUrl,
    onError: setError,
    onSuccess: () => {
      setError("");
    },
    clientId,
  });

  return isInit ? (
    <AtomsContext.Provider
      value={{
        clientId,
        accessToken: currentAccessToken,
        options,
        error,
        getClient: () => http,
        isRefreshing: isRefreshing,
        isInit: isInit,
        isValidClient: Boolean(!error && clientId && isInit),
        isAuth: Boolean(isInit && !error && clientId && currentAccessToken && http.getAuthorizationHeader()),
        t: (key, values) => {
          let translation = String(enTranslations[key as translationKeys] ?? "");
          if (!translation) {
            return "";
          }
          if (values) {
            const valueKeys = Object.keys(values) as (keyof typeof values)[];
            if (valueKeys.length) {
              valueKeys.forEach((valueKey) => {
                if (translation)
                  translation = translation.replace(
                    `{{${String(valueKey)}}}`,
                    values[valueKey]?.toString() ?? `{{${String(valueKey)}}}`
                  );
              });
            }
          }

          return replaceOccurrences(translation, enTranslations) ?? "";
        },
        i18n: {
          language: "en",
          defaultLocale: "en",
          locales: ["en"],
          exists: (key: translationKeys | string) => Boolean(enTranslations[key as translationKeys]),
        },
      }}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </AtomsContext.Provider>
  ) : (
    <>
      {children}
      <Toaster />
    </>
  );
}

function replaceOccurrences(input: string, replacementMap: { [key: string]: string }): string {
  const pattern = /\$t\((.*?)\)/g;
  return input.replace(pattern, (match, key) => {
    if (key in replacementMap) {
      return replacementMap[key];
    }
    // If the key is not found in the replacement map, you may choose to return the original match
    return match;
  });
}
