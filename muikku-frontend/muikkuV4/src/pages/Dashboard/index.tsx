import { Container, Title, Text, Paper, Button, Group, SimpleGrid } from "@mantine/core";
import { useAtomValue } from "jotai";
import { userAtom } from "src/atoms/auth";
import { Link } from "react-router";
import { SimpleMaterialLoader } from "src/materials/MaterialLoader";

const sampleHTML = String.raw`
  <div>
    <h1>Test Material</h1>
    <p>This is a test paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
    <img src="test-image.jpg" alt="Test image" />
    <table>
      <tr><th>Header 1</th><th>Header 2</th></tr>
      <tr><td>Cell 1</td><td>Cell 2</td></tr>
    </table>
    <p dir="ltr"><span class="math-tex">\(5 \times (3 + 2) = 25\)</span></p>

    <p dir="ltr"><span class="math-tex">\(\frac{1}{2} + \frac{2}{3} = \frac{7}{6}\)</span></p>

    <p dir="ltr"><span class="math-tex">\(\sqrt{x^2 + y^2} = z\)</span></p>

    <p dir="ltr"><span class="math-tex">\(x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\)</span></p>

    <p dir="ltr"><span class="math-tex">\(\sin^2(\theta) + \cos^2(\theta) = 1\)</span></p>

    <p dir="ltr"><span class="math-tex">\(\sum_{i=1}^{n} i = \frac{n(n+1)}{2}\)</span></p>

    <p dir="ltr"><span class="math-tex">\(\int_{0}^{\infty} e^{-x} dx = 1\)</span></p>

    <p dir="ltr"><span class="math-tex">\(\log_b(xy) = \log_b(x) + \log_b(y)\)</span></p>

    <p dir="ltr"><span class="math-tex">\(\lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = e\)</span></p>

    <p dir="ltr"><span class="math-tex">\(\frac{1}{2} + \frac{2}{3} = \frac{7}{6}\)</span></p>

    <p dir="ltr"><span class="math-tex">\(–3 \frac23\)</span></p>

    <p dir="ltr"><span dir="ltr" lang="fi"><span class="math-tex">\(x=\frac{-b\pm \sqrt{b^2-4ac}}{2a}\)</span></span></p>

    <p dir="ltr"><span dir="ltr" lang="fi">Luvun&nbsp;<span class="math-tex">\(–3 \frac23\)</span> käänteisluku on <span class="math-tex">\(– \frac3{11}\)</span>. (Sekaluku muutetaan ensin murtoluvuksi <span class="math-tex">\(–3 \frac23= – \frac{11}3\)</span>.)</span></p>
  
    <p dir="ltr"><span class="math-tex">\( A = \begin{pmatrix} a_{11} & a_{12} & \cdots & a_{1n} \\ a_{21} & a_{22} & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ a_{m1} & a_{m2} & \cdots & a_{mn} \end{pmatrix} \)</span></p>

    <p dir="ltr"><span class="math-tex">\( x = a_0 + \frac{1}{a_1 + \frac{1}{a_2 + \frac{1}{a_3 + \dots}}} \)</span></p>

    <p dir="ltr"><span class="math-tex">\( \oint_C \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) dx dy = \iint_D (\nabla \cdot \mathbf{F}) \, dA \)</span></p>

    <p dir="ltr"><span class="math-tex">\( f(n) = \begin{cases} n/2 & \text{jos } n \text{ on parillinen} \\ 3n+1 & \text{jos } n \text{ on pariton} \end{cases} \)</span></p>

    <p dir="ltr"><span class="math-tex">\( \psi(x,t) = \sum_{n=1}^{\infty} c_n \sqrt{\frac{2}{L}} \sin\left(\frac{n\pi x}{L}\right) e^{-iE_n t / \hbar} \)</span></p>

    <p dir="ltr"><span class="math-tex">\( R^\mu_{\nu\rho\sigma} = \partial_\rho \Gamma^\mu_{\nu\sigma} - \partial_\sigma \Gamma^\mu_{\nu\rho} + \Gamma^\mu_{\lambda\rho}\Gamma^\lambda_{\nu\sigma} - \Gamma^\mu_{\lambda\sigma}\Gamma^\lambda_{\nu\rho} \)</span></p>

    <p dir="ltr"><span class="math-tex">\( \binom{n}{k} = \frac{n!}{k!(n-k)!} \implies \sum_{k=0}^{n} \binom{n}{k} x^k y^{n-k} = (x+y)^n \)</span></p>

    <p dir="ltr"><span class="math-tex">\( \nabla \times \mathbf{E} = -\frac{\partial \mathbf{B}}{\partial t} \quad \text{ja} \quad \nabla \cdot \mathbf{B} = 0 \)</span></p>

    <p dir="ltr"><span class="math-tex">\(C_6H_{12}O_6\)</span></p>

    <p dir="ltr"><span class="math-tex">\(SO_4^{2-}\)</span></p>

    <p dir="ltr"><span class="math-tex">\(N_2(g) + 3H_2(g) \rightleftharpoons 2NH_3(g)\)</span></p>

    <p dir="ltr"><span class="math-tex">\(6CO_2 + 6H_2O \xrightarrow{\text{valo}} C_6H_{12}O_6 + 6O_2\)</span></p>

    <p dir="ltr"><span class="math-tex">\(CH_4 + Cl^\bullet \rightarrow CH_3^\bullet + HCl\)</span></p>

    <p dir="ltr"><span class="math-tex">\({}_{92}^{238}\text{U} \rightarrow {}_{90}^{234}\text{Th} + {}_{2}^{4}\text{He}\)</span></p>

    <p dir="ltr"><span class="math-tex">\([Co(NH_3)_6]Cl_3\)</span></p>

  </div>
`;

/**
 * Dashboard - Dashboard page
 */
export function Dashboard() {
  const user = useAtomValue(userAtom);

  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Welcome back, {user?.displayName ?? "User"}!
        </Title>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the authenticated area of the application.
        </Text>
        <Text mb="xl">
          This is where you can access all the features and pages available to
          authenticated users. Use the navigation bar above to explore different
          sections.
        </Text>
      </Paper>

      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Here is your workspace: bi1-elama-ja-evoluutio
        </Title>
        <Text size="lg" c="dimmed" mb="lg">
          Click link to access selected workspace
        </Text>

        <Group>
          <Button
            component={Link}
            to="/workspace/bi1-elama-ja-evoluutio"
            variant="filled"
          >
            Go to Test Workspace
          </Button>
        </Group>
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md" mt="md">
        <Paper p="xl" withBorder>
          <Title order={4}>MathLive</Title>
          <SimpleMaterialLoader html={sampleHTML} mathEngine="mathlive" />
        </Paper>
        <Paper p="xl" withBorder>
          <Title order={4}>KaTeX</Title>
          <SimpleMaterialLoader html={sampleHTML} mathEngine="katex" />
        </Paper>
        <Paper p="xl" withBorder>
          <Title order={4}>MathJax</Title>
          <SimpleMaterialLoader html={sampleHTML} mathEngine="mathjax" />
        </Paper>
      </SimpleGrid>

      {/* <Paper p="xl" mt="md" withBorder>
        <SimpleMaterialLoader html={sampleHTML} />
      </Paper> */}
    </Container>
  );
}
