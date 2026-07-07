# Handover — Contact Form & Instagram Feed

Two things on the homepage connect to outside services. Both keys below are
safe to be public (that's how these services are designed) and both are
editable in the CMS at `/admin` → **Site Settings**, so you never need a code
change to update them.

---

## Contact form → Web3Forms

**Service:** [web3forms.com](https://web3forms.com)
**Access key:** `d0de0247-d5ac-4a03-ad2c-a94850a1c31f`

How it works: the form on the homepage submits straight to
`https://api.web3forms.com/submit`. Web3Forms reads the access key, matches
it to your registered email, and forwards the message there — no server of
ours involved. The key is meant to be public; someone finding it can only
send mail *to you*, they can't read anything or send as you.

What's built into the form (all hidden, none visible to visitors):
- `access_key` — routes the message to your inbox
- `subject` — labels every email "New enquiry — rahulb.me portfolio" so it's easy to spot
- `from_name` — sets the sender name shown in your inbox to "Rahul Bhatt Portfolio"
- `botcheck` — a hidden honeypot checkbox; real visitors never see or fill it in, but spam bots that auto-fill every field will tick it, and Web3Forms silently discards those submissions

**To reconnect or change it:** go to `/admin` → Site Settings → General & SEO
→ "Contact form access key". If you ever want a fresh key (e.g. new
Web3Forms account), create one at web3forms.com and paste it in there.

**To see submissions or change the destination email:** log into
web3forms.com with the account this key belongs to.

---

## Instagram feed → Behold

**Service:** [behold.so](https://behold.so)
**Feed URL:** `https://feeds.behold.so/gd1mZ0h4uWqk1TGNEUIi`

How it works: Behold connects to your Instagram account and republishes your
latest posts as a read-only JSON feed at the URL above. The homepage fetches
that feed directly in the visitor's browser and shows the first 6 posts as
square tiles — each one links out to the real Instagram post in a new tab.
Free plan shows 6 posts and refreshes once a day.

If the feed doesn't respond (network hiccup, Behold account issue), the
tiles automatically fall back to any images added manually in
`/admin` → Homepage → Instagram row, and if those are empty too, to plain
placeholder tiles — so the section never shows a broken image.

**To reconnect or change it:** go to `/admin` → Site Settings → General & SEO
→ "Instagram feed URL". If you ever reconnect Instagram or create a new
Behold feed, paste the new feed URL in there.

**To manage the Behold connection itself** (re-authorize Instagram, change
which posts show, upgrade the plan): log into behold.so.

---

*Both of these were originally set up on an earlier version of this site and
carried across when it was rebuilt on 2026-07-07.*
