<?php

namespace App\Helpers;

class ObfuscateHelper
{
    /**
     * Obfuscate email address for privacy
     * Example: john.doe@example.com -> joh***@example.com
     */
    public static function email(?string $email): ?string
    {
        if (!$email) {
            return null;
        }

        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            return $email;
        }

        $username = $parts[0];
        $domain = $parts[1];

        // Show first 3 characters, hide the rest
        $visibleLength = min(3, strlen($username));
        $obfuscated = substr($username, 0, $visibleLength) . '***';

        return $obfuscated . '@' . $domain;
    }

    /**
     * Obfuscate phone number for privacy
     * Example: 081234567890 -> 081***7890
     */
    public static function phone(?string $phone): ?string
    {
        if (!$phone) {
            return null;
        }

        // Remove all non-numeric characters
        $cleaned = preg_replace('/[^0-9]/', '', $phone);

        if (strlen($cleaned) < 6) {
            return $phone; // Too short to obfuscate safely
        }

        // Show first 3 and last 4 digits
        $start = substr($cleaned, 0, 3);
        $end = substr($cleaned, -4);

        return $start . '***' . $end;
    }
}
