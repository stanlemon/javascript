// While typescript is preferred, you can also use good ol javascript too!
/**
 *
 * @param {Object} props
 * @param {number} [props.level]
 * @param {React.ReactNode} [props.children]
 * @returns {JSX.Element}
 */
export function Header({ level = 1, children = "Hello World!" }) {
  const Tag = `h${level}`;
  return <Tag>{children}</Tag>;
}

export default Header;
