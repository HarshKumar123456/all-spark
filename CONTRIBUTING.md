# Contributions are always welcomed here

We strongly feels that team transforms a good project to great project thus we values contributions. But before contributing please read our [CODE OF CONDUCT](CODE_OF_CONDUCT.md).


## Reporting security issues

We take security seriously. If you discover a security issue, please bring it to our attention right away!

Please DO NOT file a public issue, instead, send your report privately to harshkumar92200@gmail.com with the Subject Line "Security Issue" and in the very first line of the body of mail explain briefly about the issue.

Please include them to help us recovering faster from that Security issue :
- Location of the issue i.e. file paths and their names ?
- How you caught that issue ?
- How to reproduce that ?
- What is at risk by that?

Security reports are greatly appreciated and we will publicly thank you for them. We currently do not offer a paid security bounty program but are not ruling it out in the future.






## Reporting other issues

A great way to contribute to the project is to send a detailed report when you encounter an issue. We always appreciate a well-written, thorough bug report, and will thank you for it!

Check that our issue database doesn't already include that problem or suggestion before submitting an issue. If you find a match, you can use the "subscribe" button to get notified of updates. Do not leave random "+1" or "I have this too" comments, as they only clutter the discussion, and don't help to resolve it. However, if you have ways to reproduce the issue or have additional information that may help resolve the issue, please leave a comment.

When reporting issues, always include:

- Location of the issue i.e. file paths and their names ?
- How you caught that issue ?
- How to reproduce that ?
- What is at risk by that?

Also, include the steps required to reproduce the problem if possible and applicable. This information will help us review and fix your issue faster. When sending lengthy log files, consider posting them as a gist (https://gist.github.com). Don't forget to remove sensitive data from your log files before posting (you can replace those parts with "THIS_IS_REPLACED").

Note: Maintainers might request additional information to diagnose an issue, if initial reporter doesn't answer within a reasonable delay (a few weeks), issue will be closed.












## Pull requests are always welcomed here

Not sure if that typo is worth a pull request? Found a bug and know how to fix
it? Do it! We will appreciate it. Any significant change, like adding a backend,
should be documented as
[a GitHub issue](https://github.com/harshkumar123456/all-spark/issues)
before anybody starts working on it.

We are always thrilled to receive pull requests. We do our best to process them
quickly. If your pull request is not accepted on the first try,
don't get discouraged!








### Conventions

Fork the repository and make changes on your fork in a feature branch:

- If it's a bug fix branch, name it XXXX-something where XXXX is the number of
    the issue.
- If it's a feature branch, create an enhancement issue to announce
    your intentions, and name it XXXX-something where XXXX is the number of the
    issue.

Write clean code. Universally formatted code promotes ease of writing, reading, and maintenance.

Pull request descriptions should be as clear as possible and include a reference to all the issues that they address.

Commit messages must start with a capitalized and short summary (max. 50 chars) written in the imperative, followed by an optional, more detailed explanatory text which is separated from the summary by an empty line.

Code review comments may be added to your pull request. Discuss, then make the suggested modifications and push additional commits to your feature branch. Post a comment after pushing. New commits show up in the pull request automatically, but the reviewers are notified only when you comment.

Pull requests must be cleanly rebased on top of the base branch without multiple branches mixed into the PR.

**Git tip**: If your PR no longer merges cleanly, use rebase master in your feature branch to update your pull request rather than merge master.



Before you make a pull request, squash your commits into logical units of work
using `git rebase -i` and `git push -f`. A logical unit of work is a consistent
set of patches that should be reviewed together: for example, upgrading the
version of a vendored dependency and taking advantage of its now available new
feature constitute two separate units of work. Implementing a new function and
calling it in another file constitute a single logical unit of work. The very
high majority of submissions should have a single commit, so if in doubt: squash
down to one.

Include documentation changes in the same pull request so that a revert would remove all traces of
the feature or fix.

Include an issue reference like `Closes #XXXX` or `Fixes #XXXX` in the pull
request description that closes an issue. Including references automatically
closes the issue on a merge.

Please do not add yourself to the `AUTHORS` file, as it is regenerated regularly
from the Git history.










## Sign your work

The sign-off is a simple line at the end of the explanation for the patch. Your signature certifies that you wrote the patch or otherwise have the right to pass it on as an open-source patch. The rules are pretty simple: if you can certify the below (from developercertificate.org):

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.
660 York Street, Suite 102,
San Francisco, CA 94110 USA

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```

Then you just add a line to every git commit message:

    Signed-off-by: Harsh Kumar <harshkumar92200@gmail.com>

Use your real name (sorry, no pseudonyms or anonymous contributions.)

If you set your `user.name` and `user.email` git configs, you can sign your
commit automatically with `git commit -s`.




## Coding Patterns

We Believe if we can measure something then we can make that even better thus we follows writing verbose comments explaning what our code is doing. We uses standard coding practices while writing code so that everyone can understand what and why the code exists for.

Please See our existing code to understand better how we write code and read standard coding practices. But to demonstrate a quick thinking while writing a code let us take an example of writing a code that takes 2 numbers as input and prints the sum of those numbers:

```

// Function to get sum of 2 Numbers
const addTwoNumbers = (firstNumber, secondNumber) => {

    // Adding the numbers received in the input
    let sumOfTwoNumbers = firstNumber + secondNumber;

    // returning the response
    return sumOfTwoNumbers;

};


```


Again we are not saying to just fill every line with comments but to make atleast logical bits of the code explained by the comments and without the comments too the code variables and all should say their story. Hope you got the idea. 

**We are Excited to see your imaginations into our platform.**

Happy Coding : ) 