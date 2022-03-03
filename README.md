# Spectral Spelling and Grammar Ruleset

One of the things I find across the contracts I work on is the lack of attention to detail in getting spelling and grammar correct in OpenAPI documents. Sure, most developers don't care about this stuff, but it takes the shine of what should be a fundamental part of the product offering.

I've therefore knocked together this [Spectral](https://meta.stoplight.io/docs/spectral/ZG9jOjYx-overview) ruleset as a little proof-of-concept. It uses a [Custom Function](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTkw-custom-functions) and the Atom package [`spellchecker`](https://www.npmjs.com/package/spellchecker), which offers up some bindings to the system spell checker. Note **no grammar features are implemented right now - to be implemented in due course**.

It's just something for folks to pick up and use. The biggest drawback with the approach is the binding to the system dictionary, which may of course be in a different language to the one the OpenAPI document is being authored in. However, I'm sure clever folks out there can iron this wrinkle out (probably by swapping the `spellchecker` dependency for something a bit more "flexible").

## Example

By way of exemplar, I've knocked together an [OpenAPI document](test/misspelt-openapi.yaml) with a bunch of spelling mistakes. If you run the following:

```bash
yarn install
yarn run lint rulesets/spell-check.yaml test/misspelt-openapi.yaml # For convenience, ideally install Spectral globally
```

You should get the following output:

```bash
➜  spectral-spell-check git:(master) ✗ yarn run lint rulesets/spell-check.yaml test/misspelt-openapi.yaml
yarn run v1.22.17
$ npx spectral lint --ruleset rulesets/spell-check.yaml test/misspelt-openapi.yaml

/Users/chris/Documents/git/github/api-stuff/spectral-spell-check/test/misspelt-openapi.yaml
  3:10  warning  check-title-spelling        Misspelt words found in text: concpte           info.title
  4:16  warning  check-description-spelling  Misspelt words found in text: bdaly, smealt     info.description
  9:16  warning  check-summary-spelling      Misspelt words found in text: Defautl           paths./test.get.summary
 10:20  warning  check-description-spelling  Misspelt words found in text: speling, veeeryy  paths./test.get.description
 13:24  warning  check-description-spelling  Misspelt words found in text: Defalt            paths./test.get.responses[200].description

✖ 5 problems (0 errors, 5 warnings, 0 infos, 0 hints)
✨  Done in 1.37s.
➜  spectral-spell-check git:(master) ✗
```

Simple really.

## Anatomy

The anatomy of this project is pretty basic and reflects the use of Custom Functions in Spectral.

> If you are not familiar with Spectral and would like a deep dive checkout my [soup to nuts example](https://github.com/api-stuff/hands-on-with-spectral) or my [ASC presentation](https://www.youtube.com/watch?v=rddvXgnqeJQ) for a quick overview.

The fundamental parts are:

* A [custom ruleset](rulesets/spell-check.yaml) that implements rules based on finding any `description`, `summary` or `title` property in the OpenAPI document. The severity is set as a warning in this ruleset.
* Each of those rules invokes the spell check [custom function](rulesets/functions/spell-check.js) which splits the string into words and then runs the `spellchecker.isMisspelled` function on each to find the misspelt words. The words are returned in the message.

If you want to use this ruleset just clone this repository, grab the ruleset and function and reference them thus in your ruleset (I might package this stuff later if I add more functions):

```yaml
extends:
  - ./spell-check.yaml
```

Bobs your Uncle :thumbsup:.